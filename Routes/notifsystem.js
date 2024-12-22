const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// POST route to create a new notification
router.post('/notifications', async (req, res) => {
    console.log('Request Body:', req.body); // Log the request body to debug

    const { userId, message, type } = req.body;

    // Validate required fields
    if (!userId || !message) {
        return res.status(400).json({ error: 'userId, message, and type are required' });
    }

    // Validate and convert userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    try {
        const notification = new Notification({
            recipient: mongoose.Types.ObjectId(userId), // Convert to ObjectId
            message,
            type
        });
        await notification.save();
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Error saving notification: ' + error.message });
    }
});


// GET route to fetch notifications for a user
router.get('/notifications/:userId', async (req, res) => {
    const { userId } = req.params;

    // Validate and convert userId to ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
        return res.status(400).json({ error: 'Invalid userId format' });
    }

    try {
        const notifications = await Notification.find({ recipient: mongoose.Types.ObjectId(userId) });
        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching notifications: ' + error.message });
    }
});



module.exports = router;