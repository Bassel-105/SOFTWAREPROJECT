import { Request, Response } from 'express';
import Chat from '../SOFTWAREPROJECT/models/Chat';  // Ensure the correct path

export const createChat = async (req: Request, res: Response) => {
    console.log("Received POST request at /chats/chat");  // Log the request
    const { messages, sender, recipient } = req.body;
    try {
      const chat = new Chat({ messages, sender, recipient });
      await chat.save();
      res.status(201).json(chat);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };
  export const getChats = async (req: Request, res: Response): Promise<void> => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error: any) {
        res.status(400).json({ error: error.message });
    }
};