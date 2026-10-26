import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import { VideoX } from '@/types/vop/video/vision.x';
import { encrypt } from '@/core/security/encryption';
import cloudinary from 'cloudinary';
import { v4 as uuidv4 } from 'uuid';
import multiparty from 'multiparty';
import fs from 'fs';

export const config = {
  api: {
    bodyParser: false, // Desabilita o body parser padrão para permitir o upload de arquivos
  },
};

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const costPerVideoPost = 950; // Custo por postagem de vídeo
const XP_PER_POST = 50; // XP ganho por postagem

// Função para upload do vídeo para o Cloudinary
async function uploadVideoToCloudinary(thumbBuffer: Buffer, filename: string): Promise<string> {
  return new Promise((resolve, reject) => {
    cloudinary.v2.uploader.upload_stream(
      { resource_type: 'auto', public_id: filename },
      (error, result) => {
        if (error) {
          reject(new Error('Erro ao enviar thumbnail do video  para o Cloudinary'));
        } else if (result?.secure_url) {
          resolve(result.secure_url);
        } else {
          reject(new Error('URL imagem não disponível após upload'));
        }
      }
    ).end(thumbBuffer);
  });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const form = new multiparty.Form();

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error('Erro ao processar o formulário:', err);
        return res.status(500).json({ error: 'Erro ao processar o formulário.' });
      }

      // Recuperando campos do formulário
      const description = fields.description ? fields.description[0] : undefined;
      const title = fields.title ? fields.title[0] : undefined;
      const userId = fields.userId ? fields.userId[0] : undefined;
      const videourl = fields.videourl ? fields.videourl[0] : undefined;
  
      if (!description || !title ||  !userId || !videourl) {
        return res.status(400).json({ error: 'Description, title, videourl e userId são obrigatórios.' });
      }

      const { db } = await dbConnect();
      const userCollection = db.collection('items');
      const reformsCollection = db.collection('reforms');
      const notificationsCollection = db.collection('notifications');
      const memberStatsCollection = db.collection('member-stats');
      const collection = db.collection(postVisionCollection);

      // Verificação de reform do usuário
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
        if (!user || user.coins < costPerVideoPost) {
          return res.status(403).json({ error: 'Você não tem 950 Orbs para a postagem.' });
        }
        await userCollection.updateOne({ id: userId }, { $inc: { coins: -costPerVideoPost } });
      }

      try {
        const videoFile = files.PasVideo ? files.PasVideo[0] : undefined;
        if (!videoFile) {
          return res.status(400).json({ error: 'Arquivo de thumbnail video não enviado.' });
        }

        const videoBuffer = await fs.promises.readFile(videoFile.path);
        const folderName = 'postvision'; 
        const filename = `${folderName}/${`video-${uuidv4()}`}`;
    
        const uploadedVideoUrl = await uploadVideoToCloudinary(videoBuffer, filename);

        const postVisionData: VideoX = {
          description,
          videourl,
          title,
          PasVideo: uploadedVideoUrl, // URL da thumbanail do vídeo enviado para o Cloudinary
          userId,
          likes: 0,
          comments: [],
          type: 'video',
          createdAt: new Date(),
   
        };

        const result = await collection.insertOne(postVisionData);

        await reformsCollection.updateOne({ userId: userId }, { $inc: { usednumber: 1 } });

        await memberStatsCollection.updateOne(
          { member_id: userId },
          { $inc: { xp: XP_PER_POST, clubactivity: XP_PER_POST } }
        );

        // Se o usuário não tiver contrato de visão, registrar a transação
        if (!contractvision) {
          const transaction = {
            date: new Date().toLocaleDateString(),
            time: new Date().toLocaleTimeString(),
             timestamp: new Date(),
            amount: costPerVideoPost,
            currency: 'coins',
            action: 'video_post_creation',
          };
          await userCollection.updateOne({ id: userId }, { $push: { transactions: transaction } });
        }

        const notificationMessage = `Você criou um novo post de vídeo com sucesso.${!contractvision ? ` Custo: ${costPerVideoPost} Orbs.` : ' Sem custo por possuir Contract Vision.'}`;
        const notification = {
          userId: userId,
          type: 'video_post_creation',
          title: 'Postagem de Vídeo Criada',
          message: notificationMessage,
          timestamp: new Date(),
        };

        await notificationsCollection.insertOne(notification);

        const updatedUser = await userCollection.findOne({ id: userId });
        const nvxcrypted = encrypt(JSON.stringify(updatedUser));

        return res.status(201).json({ message: 'Postagem de vídeo feita com sucesso', postId: result.insertedId, log: nvxcrypted });
      } catch (error) {
        console.error('Erro ao salvar post de vídeo:', error);
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }
    });
  } else {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }
}
