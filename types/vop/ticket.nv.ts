import mongoose, { Document, Schema } from 'mongoose';

export interface Typeticket {
    stats: string;
    ticket: string;
    data: string;
    userid: string;
}

export interface PosticketDocument extends Typeticket, Document {}

const postTicketSchema = new Schema<PosticketDocument>(
  {
    userid: String,
    data: String,
    stats: String,
    ticket: String,
  },
  { timestamps: true }
);

const PostTypemarketModel = mongoose.models.ticket || mongoose.model<PosticketDocument>('ticket', postTicketSchema);

export default PostTypemarketModel;