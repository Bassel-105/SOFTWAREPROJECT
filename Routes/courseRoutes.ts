import express, { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../SOFTWAREPROJECT/models/Course"; // Ensure Course model is correctly imported
import User from "../SOFTWAREPROJECT/models/User"; // Ensure User model is correctly imported

const router = express.Router();

// 1. Add a Course (Create)
router.post("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const newCourse = new Course(req.body);
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        console.error("Error creating course:", err);
        res.status(500).json({ message: "Error creating course", error: (err as Error).message });
    }
});

// 2. Get All Courses (Read All)
router.get("/", async (req: Request, res: Response): Promise<any> => {
    try {
        const courses = await Course.find();
        res.status(200).json(courses);
    } catch (err) {
        console.error("Error fetching courses:", err);
        res.status(500).json({ message: "Error fetching courses", error: (err as Error).message });
    }
});

// 3. Get Course by courseId (Read One by custom ID)
router.get("/courseId/:courseId", async (req: Request, res: Response): Promise<any> => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(course);
    } catch (err) {
        console.error("Error fetching course:", err);
        res.status(500).json({ message: "Error fetching course", error: (err as Error).message });
    }
});

// 4. Update Course by courseId
router.put("/courseId/:courseId", async (req: Request, res: Response): Promise<any> => {
    try {
        const updatedCourse = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json(updatedCourse);
    } catch (err) {
        console.error("Error updating course:", err);
        res.status(500).json({ message: "Error updating course", error: (err as Error).message });
    }
});

// 5. Delete Course by courseId
router.delete("/courseId/:courseId", async (req: Request, res: Response): Promise<any> => {
    try {
        const deletedCourse = await Course.findOneAndDelete({ courseId: req.params.courseId });
        if (!deletedCourse) {
            return res.status(404).json({ message: "Course not found" });
        }
        res.status(200).json({ message: "Course deleted successfully" });
    } catch (err) {
        console.error("Error deleting course:", err);
        res.status(500).json({ message: "Error deleting course", error: (err as Error).message });
    }
});

// Search Courses
router.get("/search", async (req: Request, res: Response): Promise<any> => {
    try {
        const { title, category, difficultyLevel } = req.query;

        const filters: Record<string, any> = {};
        if (title) filters.title = new RegExp(title as string, "i");
        if (category) filters.category = category;
        if (difficultyLevel) filters.difficultyLevel = difficultyLevel;

        const courses = await Course.find(filters);
        res.status(200).json(courses);
    } catch (err) {
        console.error("Error searching courses:", err);
        res.status(500).json({ message: "Error searching courses", error: (err as Error).message });
    }
});

// 6. Enroll User in a Course
router.post("/enroll/:userId/:courseId", async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId, courseId } = req.params;

        // Convert userId and courseId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);
        const courseObjectId = new mongoose.Types.ObjectId(courseId);

        // Find the user by ID
        const user = await User.findById(userObjectId);
        if (!user) return res.status(404).json({ message: "User not found" });

        // Find the course by ID
        const course = await Course.findById(courseObjectId);
        if (!course) return res.status(404).json({ message: "Course not found" });

        // Check if the user is already enrolled in the course
        if (course.enrolledStudents.some(studentId => studentId.equals(userObjectId))) {
            return res.status(400).json({ message: "User is already enrolled in this course" });
        }

        // Add the user to the course's enrolledStudents array
        course.enrolledStudents.push(userObjectId);

        // Add the course to the user's enrolledCourses array
        user.enrolledCourses.push(courseObjectId);

        // Save both documents
        await course.save();
        await user.save();

        res.status(200).json({ message: "Enrolled successfully", user });
    } catch (err) {
        console.error("Error enrolling user in course:", err);
        res.status(500).json({ message: "Error enrolling user in course", error: (err as Error).message });
    }
});

// 7. Get Enrolled Courses for a User
router.get("/enrolled/:userId", async (req: Request, res: Response): Promise<any> => {
    try {
        const { userId } = req.params;

        // Convert userId to ObjectId
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Find the user and populate the enrolledCourses
        const user = await User.findById(userObjectId).populate("enrolledCourses");
        if (!user) return res.status(404).json({ message: "User not found" });

        res.status(200).json({ enrolledCourses: user.enrolledCourses });
    } catch (err) {
        console.error("Error fetching enrolled courses:", err);
        res.status(500).json({ message: "Error fetching enrolled courses", error: (err as Error).message });
    }
});

export default router;
