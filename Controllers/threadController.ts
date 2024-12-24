// controllers/threadController.ts
import { Request, Response } from 'express';
import Thread from '../SOFTWAREPROJECT/models/thread'; // Make sure the path is correct

// Create a new thread
export const createThread = async (req: Request, res: Response): Promise<void> => {
  const { courseId, title, content, creator } = req.body;

  if (!courseId || !title || !content || !creator) {
    res.status(400).json({ error: 'All fields are required' });
    return;
  }

  try {
    const thread = new Thread({ courseId, title, content, creator });
    await thread.save();
    res.status(201).json(thread);
  } catch (error: any) {
    res.status(500).json({ error: 'Error creating thread: ' + error.message });
  }
};

// Get threads for a specific course
export const getThreadsByCourse = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;

  try {
    const threads = await Thread.find({ courseId }).sort({ createdAt: -1 });
    res.status(200).json(threads);
  } catch (error: any) {
    res.status(500).json({ error: 'Error fetching threads: ' + error.message });
  }
};

// Search threads by title or content
export const searchThreads = async (req: Request, res: Response): Promise<void> => {
  const { courseId } = req.params;
  const { query } = req.query;

  try {
    const threads = await Thread.find({
      courseId,
      $or: [
        { title: { $regex: query, $options: 'i' } },
        { content: { $regex: query, $options: 'i' } },
      ],
    });
    res.status(200).json(threads);
  } catch (error: any) {
    res.status(500).json({ error: 'Error searching threads: ' + error.message });
  }
};