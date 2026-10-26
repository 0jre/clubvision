import { dbConnect } from '@/core/integration/connect';
import { containerItems } from '@/data/list_tvl/list.container';
import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';

interface Item {
    id: number;
    imagem: string;
    nameitem: string;
    priceitem: number;
    rarity: 'raro' | 'comum' | 'epico';
    limitedEdition?: boolean;
    quantity?: number;
}

const getRandomItems = (allItems: Item[], count: number): Item[] => {
    const shuffled = [...allItems].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
};

export async function GradeListed(req: NextApiRequest, res: NextApiResponse) {
    const { db } = await dbConnect(); // Conecta ao MongoDB

    if (req.method !== 'GET') {
        return res.status(405).json({ message: 'Method Not Allowed' });
    }

    try {
        const now = new Date();
        const allContainers = Object.keys(containerItems);
        const allItems = allContainers.flatMap((key) => containerItems[key]);

        // Verifica se já existe uma seleção ativa
        let openBox = await db.collection('openbox').findOne({});

        if (!openBox || openBox.nextUpdate < now) {
            // Se não há registro ou já passou do tempo, cria uma nova lista
            const itemCount = Math.floor(Math.random() * 21) + 10; // 10 a 31 itens
            const selectedItems = getRandomItems(allItems, itemCount);
            const itemIds = selectedItems.map((item) => item.id);

            const nextUpdate = new Date(now.getTime() + 84 * 60 * 60 * 1000); // Atualiza em 84h

            openBox = {
                _id: openBox?._id || new ObjectId(), // Preserve existing _id or generate a new one
                items: itemIds,
                updatedAt: now,
                nextUpdate,
            };

            // Atualiza ou insere no banco (mantém apenas 1 registro)
            await db.collection('openbox').updateOne({}, { $set: openBox }, { upsert: true });
        }

        return res.status(200).json({
            message: 'Lista de itens recuperada!',
            items: openBox.items,
            nextUpdate: openBox.nextUpdate,
        });

    } catch (error) {
        return res.status(500).json({ message: 'Erro no servidor', error });
    }
}
