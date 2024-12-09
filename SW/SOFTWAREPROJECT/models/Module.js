const mongoose = require("mongoose");
const moduleSchema = new mongoose.Schema({
    moduleId: { type: String, required: true, unique: true }, // Unique identifier for the module
    courseId: { type: String, required: true }, // Associated course ID
    title: { type: String, required: true }, // Title of the module
    content: { type: String, required: true }, // Content of the module
    resources: [{ type: String }], // Array of URLs to additional resources (optional)
    createdAt: { type: Date, default: Date.now }, // Timestamp of module creation
});

// Create the Modules model
const Module = mongoose.model("Module", moduleSchema);

module.exports = Module;
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));