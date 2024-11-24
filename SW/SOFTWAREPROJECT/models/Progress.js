const mongoose = require("mongoose");
const progressSchema = new mongoose.Schema({
    progressId: { type: String, required: true, unique: true }, // Unique identifier for progress
    userId: { type: String, required: true }, // Associated user ID
    courseId: { type: String, required: true }, // Associated course ID
    completionPercentage: { type: Number, required: true, min: 0, max: 100 }, // Percentage of course completed
    lastAccessed: { type: Date, required: true }, // Last time the course was accessed
});

// Create the Progress model
const Progress = mongoose.model("Progress", progressSchema);

module.exports = Progress;
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));