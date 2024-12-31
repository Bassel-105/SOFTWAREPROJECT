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
export const updateUserProfile = async (req: Request, res: Response) => {
    const { userId, name, email, profilePictureUrl } = req.body;

    try {
        const user = await User.findOneAndUpdate(
            { _id:userId },
            { name, email, profilePictureUrl },
            { new: true }
        );

        if (!userId) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", user });
    } catch (error) {
        res.status(500).json({ message: "Error updating profile", error });
    }
};
export const getEnrolledCourses = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const user = await User.findOne({ userId }).populate("enrolledCourses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ enrolledCourses: user.enrolledCourses });
    } catch (error) {
        res.status(500).json({ message: "Error fetching enrolled courses", error });
    }
};
export const completeCourse = async (req: Request, res: Response) => {
    const { userId, courseId, score } = req.body;

    try {
        const user = await User.findOne({ userId });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!user.completedCourses.includes(courseId)) {
            user.completedCourses.push(courseId);

            // Update average score
            user.averageScore =
                (user.averageScore * user.completedCourses.length + score) /
                (user.completedCourses.length + 1);

            await user.save();
        }

        res.status(200).json({ message: "Course marked as completed", user });
    } catch (error) {
        res.status(500).json({ message: "Error completing course", error });
    }
};
export const getUserProgress = async (req: Request, res: Response) => {
    const { userId } = req.query;

    try {
        const user = await User.findOne({ userId }).populate("completedCourses");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({
            completedCourses: user.completedCourses,
            averageScore: user.averageScore,
        });
    } catch (error) {
        res.status(500).json({ message: "Error fetching user progress", error });
    }
};


// Fetch all users
export const getAllUsers = async (req: Request, res: Response): Promise<any> => {
    try {
        const users = await User.find().select("-password"); // Exclude the password field for security
        res.status(200).json(users);
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ message: "Error fetching users", error: (error as Error).message });
    }
};
export const deleteUser = async (req: Request, res: Response): Promise<any> => {
    const { id } = req.params; // Assuming the parameter is named 'id'

    try {
        // Find and delete the user by Mongoose ObjectId
        const user = await User.findByIdAndDelete(id);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error deleting user", error });
    }
};


