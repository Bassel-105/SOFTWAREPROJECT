const mongoose = require('mongoose'); // Add this line to require mongoose

// Define the chat schema
const chatSchema = new mongoose.Schema({
    message: { type: String, required: true },
    sender: { type: String, required: true },
    recipient: { type: String, required: true },
    timestamp: { type: Date, default: Date.now }
});

// Create the Chat model
const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat; // Export the model