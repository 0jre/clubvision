import type { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, reformsCollectionName, InformationsUsers } from '@/core/integration/connect';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  const { userId, firstname, lastname, birthDate } = req.body;

  if (!userId || !firstname || !lastname || !birthDate) {
    return res.status(400).json({ message: 'Dados insuficientes.' });
  }


  try {
    const { db } = await dbConnect();

    const userReform = await db.collection(reformsCollectionName).findOne({
      userId,
      firstname,
      lastname,
      Idade: birthDate,
    });

    if (userReform) {
      await db.collection(InformationsUsers).updateOne(
        { id: userId },
        { $set: { codeVerified: true } }
      );

      return res.status(200).json({ message: 'Conta destravada com sucesso.' });
    } else {
      return res.status(400).json({ message: 'Informações incorretas.' });
    }
  } catch (error) {
    console.error('Informações incorretas ou um problema foi encotrado:', error);
    return res.status(500).json({ message: 'Informações incorretas ou um problema foi encotrado.' });
  }
};
