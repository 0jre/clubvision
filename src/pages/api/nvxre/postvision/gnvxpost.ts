import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import { PostVision } from '@/types/vop/PostVision';
import { encrypt } from '@/core/security/encryption';
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false,
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const costPerPost = 550;
const XP_PER_POST = 39;

async function uploadImageToCloudinary(imageBuffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto', public_id: filename },
      (error, result) => {
        if (error) {
          reject(new Error('Erro ao enviar a imagem para o Cloudinary'));
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('URL de imagem não disponível após upload'));
        }
      }
    ).end(imageBuffer);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const form = new multiparty.Form();

  form.parse(req, async (err, fields, files) => {
    if (err) {
      console.error('Erro ao processar o formulário:', err);
      return res.status(500).json({ error: 'Erro ao processar o formulário.' });
    }

    const description = fields.description ? fields.description[0] : undefined;
    const userId = fields.userId ? fields.userId[0] : undefined;
    
    if (!description || !userId) {
      return res.status(400).json({ error: 'Suas informações não foram carregadas.' });
    }

    const { db } = await dbConnect();
    const userCollection = db.collection('items');
    const reformsCollection = db.collection('reforms');
    const notificationsCollection = db.collection('notifications');
    const memberStatsCollection = db.collection('member-stats');
    const collection = db.collection(postVisionCollection);

    const userReform = await reformsCollection.findOne({ userId: userId });

    if (!userReform) {
      return res.status(404).json({ error: 'Registro de usuário não encontrado em reforms.' });
    }

    const { limitipost, usednumber, contractvision } = userReform;

    if (usednumber >= limitipost) {
      return res.status(403).json({ error: 'Você atingiu o limite máximo de postagens.' });
    }

    if (!contractvision) {
      const user = await userCollection.findOne({ id: userId });
      if (!user || user.coins < costPerPost) {
        return res.status(403).json({ error: 'Você não tem 550 Orbs para a postagem.' });
      }
      await userCollection.updateOne(
        { id: userId },
        { $inc: { coins: -costPerPost } }
      );
    }

    try {
      const imageFile = files.image ? files.image[0] : undefined;
      if (!imageFile) {
        return res.status(400).json({ error: 'Arquivo de imagem não enviado.' });
      }

      const imageBuffer = await fs.promises.readFile(imageFile.path);
      const folderName = 'postvision'; 
      const filename = `${folderName}/${`image-${uuidv4()}`}`;
    
      const uploadedImageUrl = await uploadImageToCloudinary(imageBuffer, filename);

      const postVisionData: PostVision = {
        description,
        imageUrl: uploadedImageUrl,
        userId,
        likes: 0,
        comments: [],
        createdAt: new Date(),
      };

      const result = await collection.insertOne(postVisionData);

      await reformsCollection.updateOne(
        { userId: userId },
        { $inc: { usednumber: 1 } }
      );

      await memberStatsCollection.updateOne(
        { member_id: userId },
        { $inc: { xp: XP_PER_POST, clubactivity: XP_PER_POST } }
      );

      if (!contractvision) {
        const transaction = {
          date: new Date().toLocaleDateString(),
          time: new Date().toLocaleTimeString(),
           timestamp: new Date(),
          amount: costPerPost,
          currency: 'coins',
          action: 'post_creation',
        };
        await userCollection.updateOne(
          { id: userId },
          { $push: { transactions: transaction } }
        );
      }

      const notificationMessage = `Você criou um novo post com sucesso.${!contractvision ? ` Custo: ${costPerPost} Orbs.` : ' Sem custo por possuir Contract Vision.'}`;
      const notification = {
        userId: userId,
        type: 'post_creation',
        title: 'Postagem Criada',
        message: notificationMessage,
        timestamp: new Date(),
      };
      await notificationsCollection.insertOne(notification);

      const updatedUser = await userCollection.findOne({ id: userId });
      const nvxcrypted = encrypt(JSON.stringify(updatedUser));

      return res.status(201).json({ message: 'Postagem feita com sucesso', postId: result.insertedId, log: nvxcrypted });
    } catch (error) {
      console.error('Erro ao salvar PostVision:', error);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
  });
}
