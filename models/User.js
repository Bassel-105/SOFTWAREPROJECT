const mongoose = require("mongoose");

// Define the schema
const userSchema = new mongoose.Schema({
    userId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ["student", "instructor", "admin"], required: true },
    profilePictureUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
});

// Export the model
const User = mongoose.model("User", userSchema);
module.exports = User;

// Function to create a new user and print attributes
const createUser = async () => {
    const newUser = new User({
        userId: "u12345",
        name: "Jane Doe",
        email: "jane.doe@example.com",
        passwordHash: "hashed_password_here",
        role: "student",
        profilePictureUrl: "https://example.com/profile/jane.jpg",
    });

    try {
        await newUser.save();
        console.log("User created successfully!");
        console.log("User attributes:");
        console.log("User ID:", newUser.userId);
        console.log("Name:", newUser.name);
        console.log("Email:", newUser.email);
        console.log("Password Hash:", newUser.passwordHash);
        console.log("Role:", newUser.role);
        console.log("Profile Picture URL:", newUser.profilePictureUrl);
        console.log("Created At:", newUser.createdAt);
    } catch (err) {
        console.error("Error creating user:", err.message);
    }
};

// Connect to MongoDB and create the user
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
