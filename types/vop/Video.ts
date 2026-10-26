
import mongoose, { Document, Schema } from 'mongoose';

export interface VideoDocument extends Document {
  title: string;
  thumbnail: string;
  description: string;
  likes: number;
  comments: {
    user: string;
    text: string;
  }[];
}

const videoSchema = new Schema<VideoDocument>(
  {
    title: String,
    thumbnail: String,
    description: String,
    likes: { type: Number, default: 0 },
    comments: [{ user: String, text: String }],
  },
  { timestamps: true }
);

export default mongoose.models.Video || mongoose.model<VideoDocument>('Video', videoSchema);