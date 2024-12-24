import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Notification from '../SOFTWAREPROJECT/models/notification'; // Ensure the path is correct

// Create a new notification
export const createNotification = async (req: Request, res: Response): Promise<void> => {
    const { userId, message, type }: { userId: string; message: string; type: string } = req.body;

    // Validate the required fields
    if (!userId || !message || !type) {
        res.status(400).json({ error: 'userId, message, and type are required' });
        return;
    }

    try {
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
        const notifications = await Notification.find({ recipient: userId }).sort({ createdAt: -1 });
        res.status(200).json(notifications);
    } catch (error: any) {
        res.status(500).json({ error: 'Error fetching notifications: ' + error.message });
    }
};