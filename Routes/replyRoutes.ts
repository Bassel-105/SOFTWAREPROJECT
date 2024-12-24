import express from 'express';
import { createReply, getRepliesByThread } from '../Controllers/replyController'; // Import the controller functions

const router = express.Router();

// Create a reply for a thread
router.post('/', createReply);

// Get replies for a specific thread
router.get('/:threadId', getRepliesByThread);

export default router;