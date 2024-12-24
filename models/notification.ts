// models/notification.ts
import mongoose, { Document, Schema } from 'mongoose';

// Define the Notification interface for type checking
interface INotification extends Document {
    recipient: mongoose.Types.ObjectId;
    message: string;
    read: boolean;
    timestamp: Date;
}

// Define the schema for the Notification model
const notificationSchema = new Schema<INotification>({
    recipient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now },
});

// Create and export the Notification model
const Notification = mongoose.model<INotification>('Notification', notificationSchema);

export default Notification;