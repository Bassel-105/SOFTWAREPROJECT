import { Request, Response } from 'express';
import Reply from '../SOFTWAREPROJECT/models/reply'; // Ensure the path is correct

// Create a reply for a thread
export const createReply = async (req: Request, res: Response): Promise<void> => {
    const { threadId, userId, content }: { threadId: string; userId: string; content: string } = req.body;

    console.log('Request Body:', req.body); // Log the request body for debugging

    // Ensure all fields are provided
    if (!threadId || !userId || !content) {
        res.status(400).json({ error: 'All fields (threadId, userId, content) are required' });
        return;
    }

    try {
        // Create and save the new reply
        const reply = new Reply({ threadId, userId, content, creator: userId });
        await reply.save();
        res.status(201).json(reply);
    } catch (error: any) {
        res.status(500).json({ error: 'Error creating reply: ' + error.message });
    }
};

// Get replies for a specific thread
export const getRepliesByThread = async (req: Request, res: Response): Promise<void> => {
    const { threadId } = req.params;

    try {
        const replies = await Reply.find({ threadId }).sort({ createdAt: 1 });
        res.status(200).json(replies);
    } catch (error: any) {
        res.status(500).json({ error: 'Error fetching replies: ' + error.message });
    }
};