const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const validator = require("validator");
const uniqueValidator = require("mongoose-unique-validator");

// Define the schema
const userSchema = new mongoose.Schema({
    userId: { 
        type: String, 
        required: true, 
        unique: true, 
        default: function() {
            return `u${Math.floor(Math.random() * 1000000)}`; // Auto-generate unique userId
        }
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Invalid email format"],
    },
    password: { 
        type: String, 
        required: true, 
    },
    role: { 
        type: String, 
        enum: ["student", "instructor", "admin"], 
        required: true 
    },
    profilePictureUrl: { type: String },
    biometricData: { // Add biometric data field
        type: String, 
        required: false // This can be optional initially
    },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }], // New field for enrolled courses
    createdAt: { type: Date, default: Date.now },
});

// Hash password before saving to DB
userSchema.pre("save", async function (next) {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 10);
    }
    next();
});

// Method to compare passwords
// Method to compare passwords
userSchema.methods.comparePassword = async function (candidatePassword) {
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password match result:", isMatch);  // Logs if the passwords match or not
    return isMatch;
};


// Add unique validation plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

// Export the model
module.exports = mongoose.model("User", userSchema);
