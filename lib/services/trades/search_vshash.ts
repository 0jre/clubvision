import { dbConnect } from '@/core/integration/connect';
import { containerItems, Item } from '@/data/list_tvl/list.container';
import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { withSession, NextIronRequest, NextIronHandler } from '@/lib/session';
import { Session } from 'next-iron-session';
import crypto from 'crypto';
import { ObjectId } from 'mongodb';

export type NextIronRequestWithSession = NextApiRequest & { session?: Session };

const checkAuth: NextApiHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
    const sessionUser = req.session?.get('user');

    if (!sessionUser) {
        return res.status(401).json({ isAuthenticated: false, message: 'Usuário não autenticado.' });
    }

    

       if (req.method == 'GET') { 
        const { vid, vhash, itemId1, itemId2 } = req.query;

        const { db } = await dbConnect();
        const user = await db.collection('users').findOne({ discriminator: vhash });
    
        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado' });
        }


        if(user.id === sessionUser.id) {
            return res.status(400).json({ error: 'Adicione outro vhash válido para prosseguir com esta operação!' });
        }
        
        if (!vhash) {
            return res.status(400).json({ error: 'O vhash é obrigatório' });
        }

        const level = await db.collection('member-stats').findOne({ member_id: user.id });
    
        const inventory1 = await db.collection('inventory').findOne({ userId: user.id });
        const inventory2 = await db.collection('inventory').findOne({ userId: sessionUser.id    });
        
       
        const itemIds1 = itemId1 ? (Array.isArray(itemId1) ? itemId1.map(String) : String(itemId1).split(',').map(String)) : [];
        const itemIds2 = itemId2 ? (Array.isArray(itemId2) ? itemId2.map(String) : String(itemId2).split(',').map(String)) : [];
        const prime = await db.collection('reforms').findOne({ userId: sessionUser.id });
        const tenMinutesMs = prime?.prime ? (64 * 60 * 60 * 1000) : (5 * 60 * 1000);
        const tradetime = await db.collection('trades').findOne({ userIdtrader: sessionUser.id, vid: vid });

        const userItems = await db.collection('items').findOne({ id: sessionUser.id });

        if (!userItems) {
          return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
        }


        if (tradetime && tradetime.status === 'pendente') {
            const now = new Date(); // Agora em UTC
            const tradeTime = new Date(tradetime.time); // Salvo em UTC
           
           
            if (now > tradeTime) {
              await db.collection('trades').updateOne(
                { vid: String(vid) },
                { $set: { status: 'expired' } }
              );
              tradetime.status = 'expired';
            }
          }
          

        try {
       
            let responseData: any = {
                trade: {
                    tradetime: tradetime ? tradetime.time : null,
                    totaltime: tenMinutesMs,
                    prime: prime?.prime ? true : false,
                    status: tradetime ? tradetime.status : null,
                    vtoken: userItems.token ? userItems.token : 0,
                },
                user: {
                    username: user.name,
                    subdominio: user.subdominio,
                    avatar: user.avatar,
                    level: level ? level.level : 0,
                    firstLoginDate: user.firstLoginDate,
                    momentum: level ? level.momentum : 0,
                },
                inventory: [],
                inventory2: []
            };
    
            
            // Criando um mapa de itens com base nos IDs
            const itemMap = new Map<number, Item>();
            for (const key in containerItems) {
                containerItems[key].forEach((item) => {
                    itemMap.set(item.id, item);
                });
            }
    
            function mapItems(inventory: any, itemIds: any) {
                if (!inventory) return [];
    
                return [{
                    _id: inventory._id,
                    userId: inventory.userId,
                    mytvls: inventory.mytvls
                        .filter((item: any) => itemIds.includes(item.uid))
                        .map((item: any) => ({
                            ...item,
                            ...itemMap.get(Number(item.id)) || null // Busca os detalhes do item pelo ID
                        }))
                        .sort(() => Math.random() - 0.5) // Embaralha os itens
                }];
            }
    
            

            
            if (itemIds1.length || itemIds2.length) {
                responseData.inventory = mapItems(inventory1, itemIds1);
                responseData.inventory2 = mapItems(inventory2, itemIds2);
            } else {
                responseData.inventory = inventory1 ? [{ _id: inventory1._id, userId: inventory1.userId, mytvls: [] }] : [];
                responseData.inventory2 = inventory2 ? [{ _id: inventory2._id, userId: inventory2.userId, mytvls: [] }] : [];
            }
    
            return res.status(200).json(responseData);
        } catch (error) { 
            console.error('Erro ao buscar o usuário:', error);
            return res.status(500).json({ error: 'Erro interno do servidor' });
        }

       }


        if (req.method == 'POST') {
            const { quantitytoken, vhash } = req.body;
            const {  itemId1, itemId2 } = req.query;

            if (!vhash || !quantitytoken) {
                return res.status(400).json({ error: 'O vhash é obrigatório' });
            }
        
            const { db } = await dbConnect();
            const user = await db.collection('users').findOne({ discriminator: vhash });
        
            if (!user) {
                return res.status(404).json({ error: 'Usuário não encontrado' });
            }
            
        
        
            const inventory1 = await db.collection('inventory').findOne({ userId: user.id });
            const inventory2 = await db.collection('inventory').findOne({ userId: sessionUser.id });
            const itemIds1 = itemId1 ? (Array.isArray(itemId1) ? itemId1.map(String) : String(itemId1).split(',').map(String)) : [];
            const itemIds2 = itemId2 ? (Array.isArray(itemId2) ? itemId2.map(String) : String(itemId2).split(',').map(String)) : [];
            const prime = await db.collection('reforms').findOne({ userId: sessionUser.id });
            const tenMinutesMs = prime?.prime ? 64 * 60 * 60 * 1000 : 5 * 60 * 1000 ; 
            const userItems = await db.collection('items').findOne({ id: sessionUser.id });

            if (!userItems) {
              return res.status(404).json({ success: false, message: 'Usuário não encontrado' });
            }

            if (!req.body.startedtrade) {
                return res.status(400).json({ error: 'Não foi possivel concluir a operação.' });
            }
        
        
            if (userItems.token < quantitytoken) {
                return res.status(400).json({ success: false, message: 'V-Tokens insuficientes para realizar o trade.' });
              }

              
            await db.collection('items').updateOne(
                { id: inventory2?.userId },
                { $inc: { token: -quantitytoken } }
            );
        
            const vid = `club_${crypto.randomUUID().replace(/\d/g, '').slice(0, 12)}`;
            

                 // Criando um mapa de itens com base nos IDs
         const itemMap = new Map<number, Item>();
                 for (const key in containerItems) {
                     containerItems[key].forEach((item) => {
                         itemMap.set(item.id, item);
                     });
                 }

               function mapItems(inventory: any, itemIds: any) {
    if (!inventory) return [];

    // Processamento de itens, se necessário, sem retornar `mytvls`
    const filteredItems = inventory.mytvls
        .filter((item: any) => itemIds.includes(item.uid))
        .map((item: any) => ({
            ...item,
            ...itemMap.get(Number(item.id)) || null
        }))
        .sort(() => Math.random() - 0.5);

    // Retorna somente se for usar os itens processados, sem a chave `mytvls`
    return filteredItems; // Ou outro objeto conforme sua necessidade
}

                
                
            await db.collection('trades').insertOne({
                vid,
                userIdreceive: user.id,
                userIdtrader: sessionUser.id,
                status: 'pendente',
                quantitytoken,
                time: new Date(Date.now() + tenMinutesMs).toISOString(),
                mytvl1: mapItems(inventory1, itemIds1), 
                mytvl2: mapItems(inventory2, itemIds2),
            });
        

            
            return res.status(200).json({ success: true, vid, status: 'pendente' });
            
        } else {
            return res.status(405).json({ error: 'Método não permitido' });

        }
   
};

const SearchVhash: NextIronHandler = async (req: NextIronRequestWithSession, res: NextApiResponse) => {
    await checkAuth(req, res);
};

export default withSession(SearchVhash);
