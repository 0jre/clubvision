import { NextApiRequest, NextApiResponse } from 'next';
import { Server } from 'socket.io';
import { dbConnect, visionAdsCollection } from "@/core/integration/connect";
import { ObjectId } from 'mongodb';
 
const io = new Server(); 
export const config = {
  api: {
    bodyParser: false,  
  },
};

export async function Advertising(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, thumbnailUrl, descriptions, DateLanc, About, Redirect } = req.body;

    if (!title || !thumbnailUrl || !descriptions || !About || !Redirect) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visionAdsCollection);
      const result = await collection.insertOne({ title, thumbnailUrl, descriptions, DateLanc, About, Redirect });

      // Emitir um evento 'update' para notificar os clientes sobre a mudança
      io.emit('update');

      res.status(201).json({ message: 'advertising saved successfully', AdsId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving advertising' });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(visionAdsCollection);
      const advertising = await collection.find({}).toArray();

      res.status(200).json(advertising);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error fetching advertising' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}



export async function Delete_Advertising(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { AdsI } = req.query;

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visionAdsCollection);
      const result = await collection.deleteOne({ _id: new ObjectId(AdsI as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Ads not found' });
      }

      res.status(200).json({ message: 'Ads deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting video' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}




export async function Ation_Advertising(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, thumbnailUrl,  descriptions, DateLanc, About, Redirect } = req.body;

    if (!title || !thumbnailUrl || !descriptions || !About || !Redirect) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visionAdsCollection);
      const result = await collection.insertOne({
        title,
        thumbnailUrl,
        descriptions,
        DateLanc,
        Redirect,
        About,
      });

      res.status(201).json({ message: 'Ads saved successfully', AdsId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving Ads' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}