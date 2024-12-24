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