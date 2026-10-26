import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, reformsCollectionName } from '@/core/integration/connect';
import { encrypt } from '@/core/security/encryption';

export async function Application_nVX(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { db } = await dbConnect();
    const searchText = req.query.search as string;

    // Construindo a query de busca
    const query = searchText ? { name: { $regex: new RegExp(searchText, 'i') } } : {};

    // Agregação usando $lookup para buscar dados relacionados em uma única consulta
    const usersWithReformInfo = await db.collection('users').aggregate([
      { $match: query }, // Filtro por nome
      { $sort: { name: 1 } }, // Ordenação por nome
      {
        $lookup: {
          from: reformsCollectionName,
          localField: '_id',
          foreignField: 'userId',
          as: 'reforms'
        }
      },
      {
        $lookup: {
          from: 'cla',
          let: { user_id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$userId', '$$user_id'] },
                    { $in: ['$$user_id', { $ifNull: ['$Members', []] }] } // Garante que Members seja um array
                  ]
                }
              }
            }
          ],
          as: 'cla'
        }
      },
      { $addFields: { reforms: { $arrayElemAt: ['$reforms', 0] }, cla: { $arrayElemAt: ['$cla', 0] } } } // Transformando arrays em objetos únicos
    ]).toArray();

    // Criptografando os dados antes de retornar
    const nvxcrypted = encrypt(JSON.stringify(usersWithReformInfo));

    res.status(200).json(nvxcrypted);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}
