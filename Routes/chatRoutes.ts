import express from 'express';
import { createChat,getChats } from '../Controllers/chatController'; // Import controller function

const router = express.Router();

// Define the route for creating a chat
router.post('/chat', createChat); // Matches POST /chats/chat
router.get('/chat', getChats);

export default router;