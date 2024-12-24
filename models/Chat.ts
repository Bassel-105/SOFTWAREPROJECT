import mongoose, { Document, Schema, Types } from "mongoose";

// Define the Message interface
interface IMessage {
    sender: Types.ObjectId; // Reference to the sender (user ID)
    content: string;        // The message content
    timestamp?: Date;       // Optional: add a timestamp
}

// Define the Chat interface for type checking
interface IChat extends Document {
    messages: IMessage[];    // Array of messages
    sender: Types.ObjectId;  // The sender of the chat
    recipient: Types.ObjectId; // The recipient of the chat
}

// Define the schema for individual messages
const messageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }, // Timestamp defaults to now
});

// Define the schema for the Chat model
const chatSchema = new Schema<IChat>({
    messages: [messageSchema], // Embed the message schema as an array
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    recipient: { type: Schema.Types.ObjectId, ref: "User", required: true },
});

// Create and export the Chat model
const Chat = mongoose.model<IChat>("Chat", chatSchema);

export default Chat;