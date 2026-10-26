import { NextApiRequest, NextApiResponse } from 'next';
import { ObjectId } from 'mongodb';
import { dbConnect, postVisionCollection } from '@/core/integration/connect';
import cloudinary from 'cloudinary';

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { videoId } = req.query;
 
    try {
    if (!videoId || typeof videoId !== 'string' || !ObjectId.isValid(videoId)) {
      return res.status(400).json({ message: 'Invalid videoId' });
    }
 
      const { db } = await dbConnect();
      const collection = db.collection(postVisionCollection);

      const post = await collection.findOne({ _id: new ObjectId(videoId as string) });

      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }

      if (post.PasVideo) {
        const videoPublicId = post.PasVideo.split('/').slice(-2).join('/').split('.')[0]; 
        if (videoPublicId) {
          await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(videoPublicId, { resource_type: 'video' }, (error, result) => {
              if (error || result?.result !== 'ok') {
                reject(new Error('Erro ao excluir vídeo do Cloudinary'));
              } else {
                resolve(result);
              }
            });
          });
        }
      }

      if (post.imageUrl) {
        const imagePublicId = post.imageUrl.split('/').slice(-2).join('/').split('.')[0]; 
        if (imagePublicId) {
          await new Promise((resolve, reject) => {
            cloudinary.v2.uploader.destroy(imagePublicId, { resource_type: 'image' }, (error, result) => {
              if (error || result?.result !== 'ok') {
                reject(new Error('Erro ao excluir imagem do Cloudinary'));
              } else {
                resolve(result);
              }
            });
          });
        }
      }

      const result = await collection.deleteOne({ _id: new ObjectId(videoId as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Post not found' });
      }

      return res.status(200).json({ message: 'Post deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting video and/or image' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
