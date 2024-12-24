import mongoose, { Document, Model, Schema } from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";
import uniqueValidator from "mongoose-unique-validator";

// Define the interface for the user document
export interface IUser extends Document {
    userId: string;
    name: string;
    email: string;
    password: string;
    role: "student" | "instructor" | "admin";
    profilePictureUrl?: string;
    biometricData?: string;
    enrolledCourses: mongoose.Types.ObjectId[];
    createdAt: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
}

// Define the schema
const userSchema = new Schema<IUser>({
    userId: {
        type: String,
        required: true,
        unique: true,
        default: function (): string {
            return `u${Math.floor(Math.random() * 1000000)}`; // Auto-generate unique userId
        },
    },
    name: { type: String, required: true },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: [validator.isEmail, "Invalid email format"],
    },
    password: { type: String, required: true },
    role: {
        type: String,
        enum: ["student", "instructor", "admin"],
        required: true,
    },
    profilePictureUrl: { type: String },
    biometricData: { type: String, required: false },
    enrolledCourses: [{ type: mongoose.Schema.Types.ObjectId, ref: "Course" }],
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
userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
    console.log("Comparing password...");
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    console.log("Password match result:", isMatch); // Logs if the passwords match or not
    return isMatch;
};

// Add unique validation plugin
userSchema.plugin(uniqueValidator, { message: "{PATH} must be unique." });

// Export the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);
export default User;
