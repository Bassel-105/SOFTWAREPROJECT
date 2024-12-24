import mongoose, { Document, Schema } from "mongoose";

export interface ICourse extends Document {
    courseId: string;
    title: string;
    description: string;
    category?: string;
    difficultyLevel?: "Beginner" | "Intermediate" | "Advanced";
    createdBy: string;
    createdAt: Date;
    enrolledStudents: mongoose.Types.ObjectId[];
}

const courseSchema = new Schema<ICourse>({
    courseId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String },
    difficultyLevel: { type: String, enum: ["Beginner", "Intermediate", "Advanced"] },
    createdBy: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    enrolledStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Course = mongoose.model<ICourse>("Course", courseSchema);
export default Course;

mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));
