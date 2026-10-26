import mongoose, { Document, Schema } from 'mongoose';

export interface PostVision {
  description: string;
  imageUrl: string;
  userId: string;
  likes: number;
  createdAt: Date;
  comments: {
    user: string;
    text: string;
  }[];
}

export interface PostVisionDocument extends PostVision, Document {}

const postVisionSchema = new Schema<PostVisionDocument>(
  {
    description: String,
    imageUrl: String,
    userId: String,
    likes: { type: Number, default: 0 },
    comments: [{ user: String, text: String }],
  },
  { timestamps: true }
);

const PostVisionModel = mongoose.models.PostVision || mongoose.model<PostVisionDocument>('PostVision', postVisionSchema);

export default PostVisionModel;
