import { ObjectId } from 'mongodb';
import { dbConnect,
  Tickethelp, visionlevel, Visionclacd, Visioncla, InformationsUsers, Guestlist, 
  postVisionCollection, reformsCollectionName, iventory, itemsCollection, 
  searchmodlog, searchsteam, searchtwitch, subpayment, withdrawalHistory, 
  Subscription, tvlnovision, monetizations, notifications, checkoutsessions 
} from '@/core/integration/connect';
import { Session } from 'next-iron-session';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';

// Função para encontrar o campo de identificação do usuário na coleção
function findUserIdFieldCla(collectionName: string): string | null {
  switch (collectionName) {
      case Visioncla:
      return 'userId';
      case Visionclacd:
      return 'id';
    default:
      return null;
  }
}

// Função para excluir documentos com base no campo de identificação do usuário
async function deleteDocumentsByUserIdCla(collection: any, userId: string | ObjectId, userIdField: string | null) {
  if (!userIdField) {
    console.error(`Could not determine userId field for collection ${collection.collectionName}`);
    return;
  }

  const filter = { [userIdField]: userId };
  await collection.deleteMany(filter);
}




// Função para encontrar o campo de identificação do usuário na coleção
function findUserIdField(collectionName: string): string | null {
  switch (collectionName) {
    case InformationsUsers:
      return 'id';
    case subpayment:
      return 'customer_email';
    case Subscription:
      return 'userId';
    case Tickethelp:
      return 'userid';
    case visionlevel:
      return 'member_id';
    case Visioncla:
      return 'userId';
    case Visionclacd:
      return 'id';
    case reformsCollectionName:
      return 'userId';
    case postVisionCollection:
      return 'userId';
    case searchsteam:
      return 'userId';
    case searchtwitch:
      return 'userId';
    case Guestlist:
      return 'id';
    case searchmodlog:
      return 'member_id';
    case itemsCollection:
      return 'id';
    case iventory:
      return 'userId';
    case tvlnovision:
      return 'userId';
    case withdrawalHistory:
      return 'userId';
    case notifications:
      return 'userId';
    case monetizations:
      return 'userId';
    case checkoutsessions:
      return 'userid';
    default:
      return null;
  }
}

// Função para excluir documentos com base no campo de identificação do usuário
async function deleteDocumentsByUserId(collection: any, userId: string | ObjectId, userIdField: string | null) {
  if (!userIdField) {
    console.error(`Could not determine userId field for collection ${collection.collectionName}`);
    return;
  }

  const filter = { [userIdField]: userId };
  await collection.deleteMany(filter);
}

export async function TrashCla(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    if (!userId) {
      res.status(400).json({ message: 'Invalid userId' });
      return;
    }

    try {
      const { db } = await dbConnect();
      const collections = [
        { collection: db.collection(Visionclacd), name: Visionclacd },
        { collection: db.collection(Visioncla), name: Visioncla },
      ];

      const deletePromises = collections.map(async ({ collection, name }) => {
        const userIdField = findUserIdFieldCla(name);
        if (!userIdField) {
          console.error(`Could not determine userId field for collection ${name}`);
          return;
        }
        await deleteDocumentsByUserIdCla(collection, userId, userIdField);
      });

      await Promise.all(deletePromises);

      res.status(200).json({ message: 'Clã deletado com sucesso!' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'error ao deletar clã' });
    }
  } else {
    res.status(405).json({ message: 'Metodo não listado' });
  }
}

 
export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {

    const sessionUser = req.session?.get('user');
    // Verifique se o usuário está autenticado
    if (!req.session || !req.session.get('user')) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

    const { db } = await dbConnect();
    const usersCollection = db.collection('users');
    const userRecord = await usersCollection.findOne({ id: sessionUser.id });
  
    const PermissionId = userRecord?.type == 'ADMIN'
   if (!PermissionId) {
     return res.status(400).json({ message: 'Permissão negada.' });
   }

  if (req.method === 'DELETE') {
    const userId = typeof req.query.userId === 'string' ? req.query.userId : '';
    if (!userId) {
      res.status(400).json({ message: 'Invalid userId' });
      return;
    }

    try {
    
      // Buscar steamId e hexId na coleção 'searchsteam'
      const searchsteamCollection = db.collection(searchsteam);
      const user = await searchsteamCollection.findOne({ userId });
      const steamId = user?.id || null;
      const hexId = user?.hexid || null;

      // Registrar no histórico de exclusões
      const usersCollection = db.collection('users');
      await usersCollection.insertOne({
        trashid: userId,
        discord_id: userRecord.discord_id,
        steamId,
        hexId,
        trash: true,
        createdAt: new Date(),
      });

      // Excluir documentos nas coleções relacionadas
      const collections = [
        { collection: db.collection(visionlevel), name: visionlevel },
        { collection: db.collection(Tickethelp), name: Tickethelp },
        { collection: db.collection(subpayment), name: subpayment },
        { collection: db.collection(Subscription), name: Subscription },
        { collection: db.collection(InformationsUsers), name: InformationsUsers },
        { collection: db.collection(Visionclacd), name: Visionclacd },
        { collection: db.collection(Visioncla), name: Visioncla },
        { collection: db.collection(reformsCollectionName), name: reformsCollectionName },
        { collection: db.collection(postVisionCollection), name: postVisionCollection },
        { collection: db.collection(searchsteam), name: searchsteam },
        { collection: db.collection(searchtwitch), name: searchtwitch },
        { collection: db.collection(Guestlist), name: Guestlist },
        { collection: db.collection(searchmodlog), name: searchmodlog },
        { collection: db.collection(itemsCollection), name: itemsCollection },
        { collection: db.collection(iventory), name: iventory },
        { collection: db.collection(tvlnovision), name: tvlnovision },
        { collection: db.collection(withdrawalHistory), name: withdrawalHistory },
        { collection: db.collection(notifications), name: notifications },
        { collection: db.collection(monetizations), name: monetizations },
        { collection: db.collection(checkoutsessions), name: checkoutsessions },
      ];

      const deletePromises = collections.map(async ({ collection, name }) => {
        const userIdField = findUserIdField(name);
        if (!userIdField) {
          console.error(`Could not determine userId field for collection ${name}`);
          return;
        }
        await deleteDocumentsByUserId(collection, userId, userIdField);
      });

      await Promise.all(deletePromises);

      res.status(200).json({ message: 'All related documents deleted successfully' });

    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting documents' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

const UserTrash: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  // Use o await para chamar a função original checkAuth
  await checkAuth(req, res);
};

export default withSession(UserTrash);