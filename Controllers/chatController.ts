import { Request, Response } from 'express';
import Chat from '../SOFTWAREPROJECT/models/Chat';  // Ensure the correct path
import User from '../SOFTWAREPROJECT/models/User'; // Assuming you have a User model

export const createChat = async (req: Request, res: Response) => {
    console.log("Received POST request at /chats/chat");  // Log the request
    const { messages, sender, recipient } = req.body;

    // Validate the required fields
    if (!messages || !sender || !recipient) {
        res.status(400).json({ error: 'Messages, sender, and recipient are required' });
        return;
    }

    try {
        // Check if the sender exists in the database
        const senderUser = await User.findById(sender);
        if (!senderUser) {
            res.status(404).json({ error: 'Sender not found' });
            return;
        }

        // Check if the recipient exists in the database
        const recipientUser = await User.findById(recipient);
        if (!recipientUser) {
            res.status(404).json({ error: 'Recipient not found' });
            return;
        }

        // Create and save the new chat
        const chat = new Chat({ messages, sender, recipient });
        await chat.save();

        res.status(201).json(chat);
    } catch (error: any) {
        res.status(500).json({ error: 'Error creating chat: ' + error.message });
    }
};

// Get all chats
export const getChats = async (req: Request, res: Response): Promise<void> => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};

// Delete a chat
export const deleteChat = async (req: Request, res: Response) => {
    const { id } = req.params;

    try {
        const chat = await Chat.findByIdAndDelete(id);
        if (!chat) {
            res.status(404).json({ error: 'Chat not found' });
            return;
        }
        res.status(200).json({ message: 'Chat deleted successfully', chat });
    } catch (error: any) {
        res.status(500).json({ error: 'Error deleting chat: ' + error.message });
    }
};
