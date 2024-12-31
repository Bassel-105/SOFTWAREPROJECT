import express, { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { verifyBiometricData } from "./SOFTWAREPROJECT/models/biometricService";
import courseRoutes from "./Routes/courseRoutes";
import authenticateToken from "./middlewares/authMiddleware"; // Middleware for token authentication
import User, { IUser } from "./SOFTWAREPROJECT/models/User"; // Ensure User model has TypeScript types
import Course, { ICourse } from "./SOFTWAREPROJECT/models/Course"; // Ensure Course model has TypeScript types
import quizRoutes from "./Routes/quizRoutes"; // Import quiz routes
import { RequestWithUser } from './middlewares/RequestWithUser'; // Make sure this is correctly imported
import chatRoutes from './Routes/chatRoutes';
import threadRoutes from './Routes/threadRoutes';
import notificationRoutes from './Routes/notificationRoutes';
import replyRoutes from './Routes/replyRoutes';
import { getStudentDashboard } from "./Controllers/studentController";
import { getInstructorAnalytics } from "./Controllers/instructorController";
import { generateExcelReport } from "./utils/downloadAnalytics"; 
import userRoutes from "./Routes/userRoutes";
import cors from "cors";
import questionbankRoutes from './Routes/questionbankRoutes';
import moduleRoutes from './Routes/moduleRoutes';
import performanceRoutes from "./Routes/performanceRoutes";
import authRoute from "./Routes/authRoute"
import adminRoute from "./Routes/adminRoute"


dotenv.config();


const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: 'http://localhost:3001', // Replace with your frontend URL
}));
app.use(express.json()); // Middleware to parse JSON requests

// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI || "")
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Routes
app.use("/courses", courseRoutes); // Course-related routes
app.use("/quizzes", quizRoutes); // Quiz-related routes (imported from quizRoutes)
app.use('/chats', chatRoutes);
app.use('/threads', threadRoutes);
app.use('/notifications', notificationRoutes);
app.use('/replies', replyRoutes);
app.use("/users", userRoutes);
app.use('/api/question-bank', questionbankRoutes);
app.use('/api/modules', moduleRoutes);
app.use('/performance',performanceRoutes)
app.use('/auth', authRoute);
app.use('/admin', adminRoute);
// Signup route
app.post("/signup", async (req: Request, res: Response): Promise<any> => {
  const { name, email, password, role, biometricImage } = req.body;

  try {
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create new user without userId and createdAt (they will be auto-generated)
    const newUser = new User({
      name,
      email,
      password, // The password should already be hashed before this step
      role,
      biometricData: biometricImage, // Optional biometric image
      enrolledCourses: [], // Empty array for enrolled courses
    });

    // Save new user to the database
    await newUser.save();

    // Respond with success message
    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
});
app.get("/student-dashboard/:studentId", authenticateToken, async (req, res) => {
  return getStudentDashboard(req, res);
});

app.get("/download-report", authenticateToken, async (_req, res) => {
  const sampleData = [
    { QuestionID: "Q1", Answer: "A", Correct: true },
    { QuestionID: "Q2", Answer: "B", Correct: false, CorrectAnswer: "C" },
  ];
  await generateExcelReport(sampleData, res);
});

// Login route
app.post("/login", async (req: Request, res: Response): Promise<any> => {
  const { username, password, biometricImage } = req.body;

  try {
    // Find user by email (assuming username is the email)
    const user = await User.findOne({ email: username });
    if (!user) {
      // Log failed login attempt
      await FailedLogin.create({
        username,
        reason: 'User not found',
        timestamp: new Date(),
      });
      return res.status(401).json({ message: "User not found" });
    }

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      // Log failed login attempt
      await FailedLogin.create({
        username,
        reason: 'Invalid password',
        timestamp: new Date(),
      });
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Biometric verification (if provided)
    if (biometricImage) {
      const isBiometricVerified = await verifyBiometricData(username, biometricImage);
      if (!isBiometricVerified) {
        // Log failed login attempt
        await FailedLogin.create({
          username,
          reason: 'Biometric verification failed',
          timestamp: new Date(),
        });
        return res.status(401).json({ message: "Biometric verification failed" });
      }
    }

    // Create JWT token
    const token = jwt.sign(
      { username: user.email, userId: user.userId, role: user.role, Id: user._id, avgScore: user.averageScore, name: user.name },
      process.env.JWT_SECRET || "",
      { expiresIn: "1h" }
    );

    // Send response with the token
    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
});

// Assuming FailedLoginAttempt is a model for logging failed login attempts
const FailedLogin = require('./SOFTWAREPROJECT/models/FailedLogin'); // Adjust the path as needed


// Enroll user in a course
app.post(
  "/enroll",
  authenticateToken,
  async (req: Request, res: Response): Promise<any> => {
    const { userId, courseId } = req.body;

    try {
      // Fetch the user from the database
      const user = await User.findOne({ userId }) as (mongoose.Document<unknown, {}, IUser> & IUser);
      if (!user) {
        res.status(404).json({ message: "User not found" });
        return; // Ensure the function ends here
      }

      // Fetch the course from the database
      const course = await Course.findOne({ courseId }) as (mongoose.Document<unknown, {}, ICourse> & ICourse);
      if (!course) {
        res.status(404).json({ message: "Course not found" });
        return; // Ensure the function ends here
      }

      // Ensure user is not already enrolled
      if (course.enrolledStudents.some(studentId => studentId.equals(userId))) {
        res.status(400).json({ message: "User is already enrolled in this course" });
        return; // Ensure the function ends here
      }

      // Enroll the user in the course
      user.enrolledCourses.push(course._id as mongoose.Types.ObjectId);
      await user.save();

      // Enroll the course in the user
      course.enrolledStudents.push(user._id as mongoose.Types.ObjectId);
      await course.save();

      res.status(200).json({ message: "Enrollment successful", course });
    } catch (error) {
      console.error("Error during enrollment:", error);
      res.status(500).json({ message: "Server error", error: (error as Error).message });
    }
  }
);

// Fetch all enrollments
app.get("/enrollments", authenticateToken, async (_req: Request, res: Response) => {
  try {
    const courses = await Course.find().populate("enrolledStudents", "name email");
    res.status(200).json(courses);
  } catch (error) {
    console.error("Error fetching enrollments:", error);
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
});

// Exam route with biometric verification
app.post("/start-exam", authenticateToken, async (req: Request, res: Response): Promise<any> => {
  const { username, biometricImage } = req.body;

  try {
    const isBiometricVerified = await verifyBiometricData(username, biometricImage);
    if (!isBiometricVerified) {
      return res.status(401).json({ message: "Biometric verification failed" });
    }

    res.status(200).json({ message: "Exam started successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: (error as Error).message });
  }
});

// Home route
app.get("/", async (_req: Request, res: Response): Promise<any> => {
  return res.send("Hello, world!");
});

// Error handling middleware
app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error(err.stack);
  res.status(500).send("Something went wrong!");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
