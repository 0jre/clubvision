import { NextApiRequest, NextApiResponse } from "next";
import { dbConnect } from "@/core/integration/connect";
import cloudinary from "cloudinary";
import multiparty from "multiparty";
import fs from "fs";

// Configuração do Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Função para enviar a imagem para o Cloudinary
const uploadImageToCloudinary = (imageBuffer: Buffer, filename: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: "auto", public_id: `cla/${filename}` },
      (error, result) => {
        if (error) {
          reject(new Error("Erro ao enviar a imagem para o Cloudinary"));
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error("URL de imagem não disponível após upload"));
        }
      }
    ).end(imageBuffer); // Envia o buffer da imagem
  });
};

// Função para deletar a imagem no Cloudinary
const deleteImageFromCloudinary = (publicId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.destroy(publicId, (error, result) => {
      if (error || result?.result !== 'ok') {
        console.error("Erro ao remover a imagem do Cloudinary:", error);
        reject(new Error("Erro ao remover a imagem do Cloudinary"));
      } else {
        resolve();
      }
    });
  });
};

// Configuração para permitir o envio de arquivos (multipart)
export const config = {
  api: {
    bodyParser: false, // Precisamos processar o upload como um formulário
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Método não permitido." });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error("Erro ao processar o formulário:", err);
      return res.status(500).json({ message: "Erro ao processar o formulário." });
    }

    const userId = fields.userId ? fields.userId[0] : undefined;
    const type = fields.type ? fields.type[0] : undefined;

    if (!userId || !type || !["LogoCla", "FaixaCla"].includes(type)) {
      return res.status(400).json({ message: "Dados incompletos ou tipo inválido." });
    }

    try {
      // Verifica qual campo de imagem estamos tratando
      const imageFile = files?.[type]?.[0] ?? undefined;

     
      if (!imageFile) {
        return res.status(400).json({ message: "Arquivo de imagem não enviado." });
      }

      //console.log('Arquivo recebido:', imageFile);

      // Conectar ao banco de dados
      const { db } = await dbConnect();
      const collection = db.collection("cla");

      // Obter a URL da imagem atual com base no tipo
      const currentData = await collection.findOne({ userId });
      if (!currentData) {
        return res.status(404).json({ message: "Clã não encontrado." });
      }

      // Seleciona a URL correta com base no tipo (LogoCla ou FaixaCla)
      const currentImageUrl = currentData[type as keyof typeof currentData];
      console.log("URL da imagem atual:", currentImageUrl);

      if (currentImageUrl) {
        // Extrair o public_id da URL
        const urlParts = currentImageUrl.split('/');
        const publicId = urlParts.slice(7).join('/').split('.')[0];

        console.log("Tentando remover a imagem do Cloudinary com public_id:", publicId);

        if (publicId) {
          // Remover a imagem anterior do Cloudinary
          await deleteImageFromCloudinary(publicId);
        } else {
          console.error("Não foi possível extrair o public_id da URL.");
        }
      }

      const imageBuffer = await fs.promises.readFile(imageFile.path); // Lê o arquivo em buffer
      const filename = `image-${userId}-${Date.now()}`;

      // Envia a nova imagem para o Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageBuffer, filename);

      const updateFields = type === "LogoCla" ? { LogoCla: imageUrl } : { FaixaCla: imageUrl };

      const result = await collection.updateOne(
        { userId },
        { $set: updateFields }
      );

      if (result.matchedCount === 0) {
        return res.status(404).json({ message: "Clã não encontrado." });
      }

      return res.status(200).json({ message: "Imagem atualizada com sucesso!", imageUrl });
    } catch (error: any) {
      console.error("Erro ao salvar a imagem:", error);
      return res.status(500).json({ message: "Erro ao atualizar a imagem.", error: error.message });
    }
  });
}
