import { encrypt } from "@/core/security/encryption";
import { dbConnect, GuestUser } from "@/core/integration/connect";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const { db } = await dbConnect();

    if (req.method === "POST") {
      const formData = req.body;

      // Verificar se o userId existe na coleção 'users'
      const usersCollection = db.collection('users');
      const userExists = await usersCollection.findOne({ id: formData.UserId });

      if (!userExists) {
        return res.status(404).json({ error: "Usuário não encontrado na coleção 'users'." });
      }

      const collection = db.collection(GuestUser);

      // Recupera o registro atual
      const existingForm = await collection.findOne({ userId: formData.UserId });

      let resultMessage = "Convite feito com sucesso!";
      let updatedData = null;

      if (existingForm) {
        // Cria um objeto com as alterações a serem feitas
        updatedData = {
          ...existingForm,
          ...formData,
        };

        // Remove os campos que não foram modificados
        for (const key in updatedData) {
          if (updatedData[key] === existingForm[key] && key !== "UserId") {
            delete updatedData[key];
          }
        }

        if (Object.keys(updatedData).length > 0) {
          // Atualiza o registro existente com as alterações
          await collection.updateOne({ userId: formData.UserId }, { $set: updatedData });
          resultMessage = "Convite atualizado com sucesso!";
        }
      } else {
        // Insere um novo registro
        await collection.insertOne(formData);
      }

      return res.status(200).json({ message: resultMessage });
    } else if (req.method === "GET") {
      // Verifica se um userId foi fornecido na query
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: "O parâmetro 'userId' é obrigatório." });
      }

      const collection = db.collection(GuestUser);

      // Busca todos os registros associados ao userId
      const userData = await collection.find({ UserId: userId }).toArray();

      if (!userData.length) {
        return res.status(404).json({ error: "Nenhum dado encontrado para este usuário." });
      }
  const nvxc = encrypt(JSON.stringify(userData));
      return res.status(200).json({ message: "Dados encontrados com sucesso!", nvxc });
    } else {
      return res.status(405).json({ error: "Método não permitido." });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
}
