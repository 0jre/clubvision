import { NextApiRequest, NextApiResponse } from 'next';
import { dbConnect, visioneventsCollection } from "@/core/integration/connect";
import { ObjectId } from 'mongodb';


export async function Events_overview(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, thumbnailUrl, descriptions, DateLanc, About } = req.body;

    if (!title || !thumbnailUrl || !descriptions || !About) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visioneventsCollection);
      const result = await collection.insertOne({ title, thumbnailUrl, descriptions, DateLanc, About });

      res.status(201).json({ message: 'advertising saved successfully', EventAds: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving advertising' });
    }
  } else if (req.method === 'GET') {
    try {
      const { db } = await dbConnect();
      const collection = db.collection(visioneventsCollection);
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
 

export async function Events_delete(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'DELETE') {
    const { Event } = req.query;

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visioneventsCollection);
      const result = await collection.deleteOne({ _id: new ObjectId(Event as string) });

      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Event not found' });
      }

      res.status(200).json({ message: 'Event deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error deleting event' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

export async function Events_oc(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { title, thumbnailUrl,  descriptions, DateLanc, About } = req.body;

    if (!title || !thumbnailUrl || !descriptions || !About ) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
      const { db } = await dbConnect();
      const collection = db.collection(visioneventsCollection);
      const result = await collection.insertOne({
        title,
        thumbnailUrl,
        descriptions,
        DateLanc,
        About,
      });

      res.status(201).json({ message: 'Event saved successfully', AdsEventId: result.insertedId });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error saving Event' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}