// models/thread.js
const mongoose = require('mongoose');

const threadSchema = new mongoose.Schema({
    courseId: { type: String, required: true }, // Course identifier
    title: { type: String, required: true },
    content: { type: String, required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Thread', threadSchema);
