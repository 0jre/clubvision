import mongoose, { Document, Schema } from 'mongoose';

export interface VideoX {
  description: string;
  PasVideo: string;
  videourl: string;
  userId: string;
  title: string;
  likes: number;
  type: string;
  createdAt: Date;
  comments: {
    user: string;
    text: string;
  }[];
}

export interface VideoVisionDocument extends VideoX, Document {}

const VideoVisionSchema = new Schema<VideoVisionDocument>(
  {
    description: String,
    PasVideo: String,
    title: String,
    videourl: String,
    userId: String,
   
    likes: { type: Number, default: 0 },
    comments: [{ user: String, text: String }],
  },
  { timestamps: true }
);

const VideoVisionModel = mongoose.models.PasVideo || mongoose.model<VideoVisionDocument>('VideoX', VideoVisionSchema);

export default VideoVisionModel;
