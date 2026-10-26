import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from '@/core/integration/connect';
import { v4 as uuidv4 } from 'uuid';
import cloudinary from 'cloudinary';
import fs from 'fs'; // Importa o módulo fs para manipulação de arquivos
import multiparty from 'multiparty'; // Importa o pacote multiparty para analisar o formulário

// Configuração do Cloudinary
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const config = {
  api: {
    bodyParser: false, // Precisamos processar o upload como um formulário
  },
};

async function uploadImageToCloudinary(imageBuffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto', public_id: filename }, // auto escolhe o tipo de recurso automaticamente
      (error, result) => {
        if (error) {
          reject(new Error('Erro ao enviar a imagem para o Cloudinary'));
        } else if (result?.secure_url) {
          resolve(result.secure_url); // Retorna a URL segura se disponível
        } else {
          reject(new Error('URL de imagem não disponível após upload'));
        }
      }
    ).end(imageBuffer); // Envia o buffer da imagem
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido.' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar o formulário:', err);
      return res.status(500).json({ message: 'Erro ao processar o formulário.' });
    }

    const userId = fields.userId ? fields.userId[0] : undefined;
    const nametvl = fields.nametvl ? fields.nametvl[0] : undefined;
    const type = fields.type ? fields.type[0] : undefined;

    if (!userId || !nametvl || !type) {
      return res.status(400).json({ message: 'Dados incompletos.' });
    }

    if (!['faixaclubr', 'avatarcubr'].includes(type)) {
      return res.status(400).json({ message: 'Tipo inválido. Use "faixaclubr" ou "avatarcubr".' });
    }

    try {
      const imageFile = files.file ? files.file[0] : undefined;
      if (!imageFile) {
        return res.status(400).json({ message: 'Arquivo de imagem não enviado.' });
      }

      const imageBuffer = await fs.promises.readFile(imageFile.path); // Lê o arquivo em buffer
      const folderName = 'tvl'; // Você pode personalizar o nome da pasta
      // Gerando o nome completo do arquivo incluindo a pasta
      const filename = `${folderName}/${`image-${uuidv4()}`}`;
      // Envia para o Cloudinary
      const imageUrl = await uploadImageToCloudinary(imageBuffer, filename);

      // Conectar ao banco de dados
      const { db } = await dbConnect();

      const imageSizeInMB = imageBuffer.length / (1024 * 1024);
      let cost = 1000 + (imageSizeInMB * (80000 - 1000)) / (type === 'faixaclubr' ? 2 : 4);
      cost = Math.min(Math.max(1000, Math.round(cost)));

      const userItems = await db.collection('items').findOne({ id: userId });
      if (!userItems || userItems.bits < cost) {
        return res.status(400).json({ message: `Saldo insuficiente. Você precisa de pelo menos ${cost} bits.` });
      }

      await db.collection('items').updateOne(
        { id: userId },
        { $inc: { bits: -cost } }
      );

      const signatureId = uuidv4();

      const registrationData = {
        signatureId,
        tvl: imageUrl, // Usando o URL da imagem hospedada no Cloudinary
        price: cost,
        nametvl,
        timestamp: new Date(),
      };

      const update = type === 'faixaclubr'
        ? { $push: { faixaclubr: registrationData } }
        : { $push: { avatarcubr: registrationData } };

      await db.collection('inventory').updateOne(
        { userId },
        update,
        { upsert: true }
      );

      const notification = {
        userId,
        type: 'buy',
        title: 'Notificação de Carteira',
        message: `Você pagou uma taxa de registro de TVLS no valor total de ${cost} Bits. ID de assinatura: ${signatureId}.`,
        timestamp: new Date(),
      };
      const notificationsCollection = db.collection('notifications');
      await notificationsCollection.insertOne(notification);

      return res.status(200).json({
        success: true,
        message: `Imagem salva com sucesso! Custo: ${cost} bits`,
        imageUrl,
        remainingBits: userItems.bits - cost,
        signatureId,
        amountPaid: cost,
      });
    } catch (error: any) {
      console.error('Erro ao salvar a imagem:', error);
      return res.status(500).json({ message: 'Erro interno do servidor.', error: error.message });
    }
  });
}
