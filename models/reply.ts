// models/reply.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the Reply interface for type checking
interface IReply extends Document {
    threadId: mongoose.Types.ObjectId;
    content: string;
    creator: mongoose.Types.ObjectId;
    createdAt: Date;
}

// Define the schema for the Reply model
const replySchema = new Schema<IReply>({
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

// Create and export the Reply model
const Reply = mongoose.model<IReply>('Reply', replySchema);

export default Reply;