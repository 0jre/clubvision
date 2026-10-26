import mongoose, { Document, Schema } from 'mongoose';

export interface Typemarket {
  description: string;
  imageUrl: string;
  userId: string;
  nvuser: string;
  AvatarUser: string;
  Contact: number;
  Press: number;
  likes: number;
  Title: string;
  type: string;
}

export interface PostmarketDocument extends Typemarket, Document {}

const postmarketSchema = new Schema<PostmarketDocument>(
  {
    description: String,
    imageUrl: String,
    userId: String,
    Title: String,
    nvuser: String,
    AvatarUser: String,
    Press: Number,
    type: String,
    Contact: Number,
    likes: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const PostTypemarketModel = mongoose.models.PostVision || mongoose.model<PostmarketDocument>('PostVision', postmarketSchema);

export default PostTypemarketModel;
