const express = require('express');
const mongoose = require('mongoose');
const http = require('http'); // for handling HTTP requests
const socketIo = require('socket.io'); // for real-time communication
require('dotenv').config(); // Load environment variables
//const Module = require('./models/Module'); // Import the Module mod
 const router = express.Router();
 const notificationsRoutes = require('./routes/notifsystem');
 const chatRoutes = require('./routes/realtimechat');

const app = express();

//app.use(bodyParser.json()); // To parse incoming JSON data
app.use(express.json());
// Use the notifications routes
app.use('/api', notificationsRoutes);


// Middleware
app.use(express.json());
// Ensure you can parse JSON data in POST requests

// Import routes


app.get('/api/threads', (req, res) => {
    // logic to handle the GET request
    res.send("Threads data");
  });

  router.post('/', (req, res) => {
    // logic to create a new thread
    res.json({ message: "Thread created" });
  });

// Use the routes
app.use('/api', chatRoutes);  // Prefix all rout

// MongoDB connection
mongoose
    .connect("mongodb://localhost:27017/DB1" )
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

// Create HTTP server for socket.io
const server = http.createServer(app);
const io = socketIo(server); // Initialize socket.io with the server

// Socket.io events
io.on('connection', (socket) => {
    console.log('A user connected');
    
    // Listen for a "message" event from clients
    socket.on('message', (data) => {
        console.log('Message received:', data);
        // Broadcast the message to all connected users
        io.emit('message', data);
    });

    // Listen for disconnection
    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});

// API routes for CRUD operations
app.post('/api/modules', async (req, res) => {
    const { moduleId, courseId, title, content, resources } = req.body;
    try {
        const module = new Module({ moduleId, courseId, title, content, resources });
        await module.save();
        res.status(201).json(module);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get('/api/modules', async (req, res) => {
    try {
        const modules = await Module.find();
        res.json(modules);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Set the port
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log('Server running on http://localhost:3000');
});