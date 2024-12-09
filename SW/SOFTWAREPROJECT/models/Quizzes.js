const mongoose = require("mongoose");

// Define the quiz schema
const quizSchema = new mongoose.Schema({
    quizId: { type: String, required: true, unique: true },
    moduleId: { type: String, required: true },
    questions: [{ type: Object, required: true }], // Array of question objects
    createdAt: { type: Date, default: Date.now },
});

// Create the model
const Quizzes = mongoose.model("Quizzes", quizSchema);

// Connect to MongoDB
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => {
        console.log("Connected to MongoDB");
        createQuiz(); // Call the function to create and save a quiz
    })
    .catch((err) => console.error("MongoDB connection error:", err));

// Function to create and save a quiz
const createQuiz = async () => {
    // Initialize a new quiz object
    const newQuiz = new Quizzes({
        quizId: "quiz123",
        moduleId: "module456",
        questions: [
            { questionId: "q1", text: "What is 2 + 2?", options: ["3", "4", "5"], answer: "4" },
            { questionId: "q2", text: "What is the capital of France?", options: ["Paris", "London", "Berlin"], answer: "Paris" },
        ],
    });

    try {
        // Save the quiz to the database
        await newQuiz.save();
        console.log("Quiz created successfully:", newQuiz);
    } catch (err) {
        console.error("Error creating quiz:", err.message);
    }
};
