import { Request, Response } from 'express';
import User from '../SOFTWAREPROJECT/models/User';
import Course from '../SOFTWAREPROJECT/models/Course';
import mongoose from 'mongoose';

// Define the request body interface to specify the expected structure
interface EnrollRequestBody {
    userId: string;
    courseId: string;
}

// Enroll a user in a course
export const enrollInCourse = async (req: Request<{}, {}, EnrollRequestBody>, res: Response): Promise<any> => {
    try {
        const { userId, courseId } = req.body;

        // Check if the user exists
        const user = await User.findOne({ userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Check if the course exists
        const course = await Course.findOne({ courseId });
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Convert courseId and userId to ObjectId
        const courseObjectId = new mongoose.Types.ObjectId(courseId);
        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Enroll the user in the course (add course to user's enrolledCourses array)
        user.enrolledCourses.push(courseObjectId);
        await user.save();

        // Add the user to the course's enrolledStudents array
        course.enrolledStudents.push(userObjectId);
        await course.save();

        res.status(200).json({ message: "Successfully enrolled in course", user });
    } catch (error: unknown) {
        if (error instanceof Error) {
            console.error(error.message);  // Access `message` safely
            res.status(500).json({ message: "Error enrolling in course", error: error.message });
        } else {
            console.error("An unknown error occurred");
            res.status(500).json({ message: "Unknown error occurred" });
        }
    }
};
