const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
    courseId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    difficultyLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],  // Revert back to ObjectId references
});

const Course = mongoose.model("Course", courseSchema);
module.exports = Course;




mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
