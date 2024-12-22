// routes/threads.js
const express = require('express');
const router = express.Router();
const Thread = require('../models/thread');

// Create a new thread
router.post('/', async (req, res) => {
    const { courseId, title, content, creator } = req.body;

    if (!courseId || !title || !content || !creator) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    try {
        const thread = new Thread({ courseId, title, content, creator });
        await thread.save();
        res.status(201).json(thread);
    } catch (error) {
        res.status(500).json({ error: 'Error creating thread: ' + error.message });
    }
});

// Get threads for a specific course
router.get('/:courseId', async (req, res) => {
    const { courseId } = req.params;

    try {
        const threads = await Thread.find({ courseId }).sort({ createdAt: -1 });
        res.status(200).json(threads);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching threads: ' + error.message });
    }
});

// Search threads by title or content
router.get('/search/:courseId', async (req, res) => {
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
    } catch (error) {
        res.status(500).json({ error: 'Error searching threads: ' + error.message });
    }
});

module.exports = router;
