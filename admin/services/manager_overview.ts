import { NextApiRequest, NextApiResponse } from 'next'
import { 
    dbConnect, 
    reformsCollectionName, 
    searchsteam, 
    Visioncla,
    Visionclacd,
    searchtwitch,
    searchmodlog,
    postVisionCollection,
    Guestlist} from '@/core/integration/connect';
import { User } from '@/types/user/interface';
import { encrypt } from '@/core/security/encryption';

// Novo tipo que inclui a propriedade _id do MongoDB
type MongoUser = User & { _id: string };

export async function Overview(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method Not Allowed' });
  }

  try {
    const { db } = await dbConnect();
    const usersCollection = db.collection<MongoUser>('users'); // Definir o tipo genérico para MongoUser
    const claCollection = db.collection(Visioncla);
    const clainivitedCollection = db.collection(Visionclacd);
    const reformsCollection = db.collection(reformsCollectionName);
    const reformsCollectiontwitch = db.collection(searchtwitch);
    const reformsCollectionsteam = db.collection(searchsteam);
    const GuestUserCollection = db.collection(Guestlist);
    const searchreformModlog = db.collection(searchmodlog);
    const postVision = db.collection(postVisionCollection);
    const searchText = req.query.search as string;
    const userId = req.query.userId as string;

    let query = {};

    if (userId) {
      query = { _id: userId }; // Busca por um usuário específico se o ID for fornecido
    } else if (searchText) {
      query = { name: { $regex: new RegExp(searchText, 'i') } };
    }

    // Ordenar os usuários pelo nome diretamente no MongoDB
    const users = await usersCollection.find(query).sort({ name: 1 }).toArray();

    const usersWithReformInfo = await Promise.all(
      users.map(async (user: MongoUser) => {
        const reformInfo = await reformsCollection.findOne({ userId: user._id });
        const Infocla = await claCollection.findOne({ userId: user._id });  
        const Infoclainvited = await clainivitedCollection.findOne({ userId: user._id }); 
        const reformInfosteam = await reformsCollectionsteam.findOne({ userId: user._id });
        const reformInfotwitch = await reformsCollectiontwitch.findOne({ userId: user._id });
        const postVisioninfo = await postVision.findOne({ userId: user._id });
        //const reformInfoGuest = await GuestUserCollection.findOne({ id: user._id });
        const reformModlog = await searchreformModlog.findOne({ member_id: user._id });
        const distinctNames = await GuestUserCollection.distinct('name', { id: user._id });
        // Conta o número de nomes distintos
        const numberOfNames = distinctNames.length;
        
        // Exibe a contagem dinamicamente
        let message = '';
        if (numberOfNames === 0) {
          message = 'Nenhum amigo';
        } else if (numberOfNames === 1) {
          message = `1 amigo: ${distinctNames[0]}`;
        } else {
          message = `${numberOfNames} amigos: ${distinctNames.join(', ')}`;
        }

        return {
          ...user,
          reforms: reformInfo ? reformInfo : null,
          twitch: reformInfotwitch ? reformInfotwitch : null,
          steam: reformInfosteam ? reformInfosteam : null,
          GuestUser: message,
          PostVision: postVisioninfo ? postVisioninfo : null,
          modlog: reformModlog ? reformModlog : null,
          cla: Infocla ? Infocla : null,
          clainvited: Infoclainvited ? Infoclainvited : null,
        };
      })
    );

    const nvxcrypted = encrypt(JSON.stringify(usersWithReformInfo));
    res.status(200).json(nvxcrypted);
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ message: 'Error fetching users' });
  }
}
