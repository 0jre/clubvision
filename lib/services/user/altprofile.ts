import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect } from "@/core/integration/connect";
import { NextIronRequest, withSession } from '@/lib/session';


export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Aumenta o limite para 10MB
    },
  },
};

const AltProfile = async (req: NextIronRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    res.status(405).end(); // Método não permitido
    return;
  }

  try {
    const { userId, avatarUrl } = req.body;

    const { db, client } = await dbConnect();
    const usersCollection = db.collection('users');

    const result = await usersCollection.updateOne(
      { _id: userId },
      { $set: { avatar: avatarUrl } }
    );


    if (result.modifiedCount === 1) {
      // Carrega os dados atualizados do MongoDB
      const updatedUserData = await usersCollection.findOne({ _id: userId });

      if (updatedUserData) {
        // Atualiza a imagem na sessão
        const updatedUserSessionData = {
          ...req.session.get("user"),
          avatar: updatedUserData.avatar,
        };

        await req.session.set("user", updatedUserSessionData);
        await req.session.save();

        res.status(200).json({ message: 'Avatar atualizado com sucesso!' });
      } else {
        res.status(400).json({ error: 'Erro ao carregar dados atualizados do usuário.' });
      }
    } else {
      res.status(400).json({ error: 'Erro ao atualizar o avatar.' });
    }
  } catch (error) {
    console.error('Erro ao atualizar o avatar:', error);
    res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

export default withSession(AltProfile);
