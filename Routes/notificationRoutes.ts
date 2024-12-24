import express from 'express';
import { createNotification, getNotificationsByUser } from '../Controllers/notificationController'; // Import the controller functions

const router = express.Router();

// POST route to create a new notification
router.post('/', createNotification);

// GET route to get notifications for a specific user
router.get('/:userId', getNotificationsByUser);

export default router;