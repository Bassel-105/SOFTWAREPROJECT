const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const Chat = require('../models/Chat');  // Go up one level from routes to models
const router = express.Router();
const app = express();
const server = http.createServer(app);
const io = new Server(server);

io.on('connection', (socket) => {
    console.log('A user connected');

    // Join a chat room
    socket.on('joinChat', ({ chatId }) => {
        socket.join(chatId);
    });

    // Send a message
    socket.on('sendMessage', async ({ chatId, senderId, content }) => {
        const chat = await Chat.findById(chatId);
        const newMessage = { sender: senderId, content };
        chat.messages.push(newMessage);
        await chat.save();

        io.to(chatId).emit('receiveMessage', newMessage);
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

router.post('/chat', async (req, res) => {
    const { message, sender, recipient } = req.body;
    try {
        const chat = new Chat({ message, sender, recipient });
        await chat.save();
        res.status(201).json(chat);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// GET route to get chat history
router.get('/chat', async (req, res) => {
    try {
        const chats = await Chat.find();
        res.status(200).json(chats);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;