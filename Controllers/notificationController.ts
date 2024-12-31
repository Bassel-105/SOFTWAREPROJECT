import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Notification from '../SOFTWAREPROJECT/models/notification'; // Ensure the path is correct
import User from '../SOFTWAREPROJECT/models/User'; // Assuming you have a User model

// Create a new notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
    const { userId, message, type }: { userId: string; message: string; type: string } = req.body;

    // Validate the required fields
    if (!userId || !message || !type) {
        res.status(400).json({ error: 'userId, message, and type are required' });
        return;
    }

    try {
        // Check if the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        // Convert userId to ObjectId
        const recipient: Types.ObjectId = new mongoose.Types.ObjectId(userId);

        // Create and save the new notification
        const notification = new Notification({ recipient, message, type });
        await notification.save();

        res.status(201).json(notification);
    } catch (error: any) {
        res.status(500).json({ error: 'Error saving notification: ' + error.message });
    }
};

// Get all notifications for a specific user
export const getNotificationsByUser = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.params;

    try {
        // Check if the user exists in the database
        const user = await User.findById(userId);
        if (!user) {
            res.status(404).json({ error: 'User not found' });
            return;
        }

        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: 'Error fetching notifications: ' + error.message });
    }
};
