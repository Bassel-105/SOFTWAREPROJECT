const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Notification = require('../models/notification');

// POST route to create a new notification
router.post('/notifications', async (req, res) => {
    const { userId, message, type } = req.body;

    // Validate the required fields
    if (!userId || !message || !type) {
        return res.status(400).json({ error: 'userId, message, and type are required' });
    }

    try {
        // Convert userId to ObjectId
        const recipient = mongoose.Types.ObjectId(userId);

        // Create a new notification using the ObjectId
        const notification = new Notification({ recipient, message, type });

        // Save the notification to the database
        await notification.save();

        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({ error: 'Error saving notification: ' + error.message });
    }
});

module.exports = router;