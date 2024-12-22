const mongoose = require("mongoose");

// Define the quiz schema
const quizSchema = new mongoose.Schema({
    quizId: { type: String, required: true, unique: true },
    moduleId: { type: String, required: true },
    category: { type: String, required: true }, // Category for adaptive quizzes
    difficultyLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"], required: true }, // Difficulty level
    questions: [
        {
            questionId: { type: String, required: true },
            text: { type: String, required: true },
            options: { type: [String], required: true }, // Array of answer options
            correctAnswer: { type: String, required: true }, // Correct answer
        },
    ], // Array of question objects
    createdAt: { type: Date, default: Date.now },
});

// Create the model
const Quizzes = mongoose.model("Quizzes", quizSchema);

module.exports = Quizzes;

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

    