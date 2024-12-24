// models/thread.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the Thread interface for type checking
interface IThread extends Document {
    courseId: string;
    title: string;
    content: string;
    creator: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

// Define the schema for Thread model
const threadSchema = new Schema<IThread>({
    courseId: { type: String, required: true }, // Course identifier
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

// Create and export the Thread model
const Thread = mongoose.model<IThread>('Thread', threadSchema);

export default Thread;