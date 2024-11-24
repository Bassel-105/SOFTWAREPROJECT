const mongoose = require("mongoose");
const responseSchema = new mongoose.Schema({
    responseId: { type: String, required: true, unique: true }, // Unique identifier for the response
    userId: { type: String, required: true }, // User who submitted the response
    quizId: { type: String, required: true }, // Associated quiz ID
    answers: [
        {
            questionId: { type: String, required: true }, // ID of the question
            answer: { type: String, required: true }, // User's answer
        },
    ], // Array of objects to store answers
    score: { type: Number, required: true, min: 0 }, // Score received for the quiz
    submittedAt: { type: Date, default: Date.now }, // Timestamp of submission
});

// Create the Responses model
const Response = mongoose.model("Response", responseSchema);

module.exports = Response;

mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));