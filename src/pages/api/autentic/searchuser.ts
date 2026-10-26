import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronHandler } from '@/lib/session';
import { dbConnect } from '@/core/integration/connect';
import { rentables } from '@/types/clubstore/list.opencontainer';

export type NextIronRequestWithSession = NextApiRequest & { session?: any };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  try {
    const sessionUser = req.session?.get('user');

    if (!sessionUser) {
      return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

    const { db } = await dbConnect();
    const usersCollection = db.collection('users');
    const reformsCollection = db.collection('reforms');
    const inventoryCollection = db.collection('inventory');

    // Executa todas as consultas de banco de dados em paralelo para maior velocidade.
    const [userRecord, prime, inventory] = await Promise.all([
      usersCollection.findOne({ id: sessionUser.id }),
      reformsCollection.findOne({ userId: sessionUser.id, prime: true }),
      inventoryCollection.findOne({ userId: sessionUser.id })
    ]);

    if (!userRecord) {
      res.setHeader('Set-Cookie', [
        'basketId=; Path=/; Max-Age=0; HttpOnly;',
        'session_cookie=; Path=/; Max-Age=0; HttpOnly;'
      ]);
      req.session?.destroy();
      return res.status(404).json({ message: 'Usuário não encontrado e sessão encerrada.' });
    }

    const now = new Date();
    const hasPrime = !!prime;
    
    // Inicializa as atualizações de inventário em um array de promessas
    const inventoryUpdates: Promise<any>[] = [];

    if (inventory) {
      // Otimiza a verificação e atualização de itens expirados em um único passo
      if (inventory.rentedItems) {
        const updatedRentedItems = inventory.rentedItems.map((item: any) => ({
          ...item,
          isActive: item.expiresAt && new Date(item.expiresAt) < now ? false : item.isActive
        }));
        inventoryUpdates.push(
          inventoryCollection.updateOne(
            { userId: sessionUser.id },
            { $set: { rentedItems: updatedRentedItems } }
          )
        );
      }

      if (inventory.mytvls) {
        const updatedMytvls = inventory.mytvls.map((item: any) => ({
          ...item,
          isActive: item.expiresAt && new Date(item.expiresAt) < now ? false : item.isActive
        }));
        inventoryUpdates.push(
          inventoryCollection.updateOne(
            { userId: sessionUser.id },
            { $set: { mytvls: updatedMytvls } }
          )
        );
      }

      // Adiciona as promessas de atualização de rentables
      for (const rentable of rentables) {
        const itemExpired = inventory.rentedItems?.some(
          (item: any) => item.itemId === rentable && item.expiresAt && new Date(item.expiresAt) < now
        );
        if (inventory[rentable] && itemExpired) {
          inventoryUpdates.push(
            inventoryCollection.updateOne(
              { userId: sessionUser.id },
              { $unset: { [rentable]: '' } }
            )
          );
        }
      }
    }

    // Aguarda todas as atualizações de inventário em paralelo antes de continuar
    if (inventoryUpdates.length > 0) {
      await Promise.all(inventoryUpdates);
    }
    
    const infobasic = {
      ...sessionUser,
      name: userRecord.name,
      discriminator: userRecord.discriminator,
      subdominio: userRecord.subdominio,
      ip: userRecord.ip,
      prime: hasPrime
    };

    return res.status(200).json({ isAuthenticated: true, user: infobasic });
  } catch (error) {
    // Tratamento de erro robusto. Retorna um erro genérico 500 para o cliente.
    return res.status(500).json({ error: 'Erro interno do servidor.' });
  }
};

const GetInfoUserSession: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
  await checkAuth(req, res);
};

export default withSession(GetInfoUserSession);

