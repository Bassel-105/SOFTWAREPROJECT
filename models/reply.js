// models/reply.js
const mongoose = require('mongoose');

const replySchema = new mongoose.Schema({
    threadId: { type: mongoose.Schema.Types.ObjectId, ref: 'Thread', required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Reply', replySchema);
