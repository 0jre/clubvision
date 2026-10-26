import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/core/integration/connect";


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumenta o limite para 10MB
    },
  },
};

export async function AlterAvatarUser (req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).end(); // Método não permitido
  }

  try {
    const { userId, avatarUrl } = req.body;

    const { db, } = await dbConnect();
    const usersCollection = db.collection('reforms'); // Substitua pelo nome da sua coleção

    const result = await usersCollection.updateOne(
      { userId: userId },  
      { $set: { bannerfundo: avatarUrl } }   
    );



    if (result.modifiedCount === 1) {
      return res.status(200).json({ message: 'Avatar atualizado com sucesso!' });
    } else {
      return res.status(400).json({ error: 'Erro ao atualizar o avatar.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o avatar:', error);
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};