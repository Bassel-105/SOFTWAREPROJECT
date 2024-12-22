// routes/replies.js
const express = require('express');
const router = express.Router();
const Reply = require('../models/reply');

// Create a reply for a thread
router.post('/', async (req, res) => {
    const { threadId, userId, content } = req.body;

    console.log('Request Body:', req.body); // Log the request body for debugging

    // Ensure all fields are provided
    if (!threadId || !userId || !content) {
        return res.status(400).json({ error: 'All fields (threadId, userId, content) are required' });
    }

    try {
        // Create and save the new reply, setting `creator` as `userId`
        const reply = new Reply({ threadId, userId, content, creator: userId });
        await reply.save();

        res.status(201).json(reply);
    } catch (error) {
        res.status(500).json({ error: 'Error creating reply: ' + error.message });
    }
});



// Get replies for a specific thread
router.get('/:threadId', async (req, res) => {
    const { threadId } = req.params;

    try {
        const replies = await Reply.find({ threadId }).sort({ createdAt: 1 });
        res.status(200).json(replies);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching replies: ' + error.message });
    }
});

module.exports = router;
