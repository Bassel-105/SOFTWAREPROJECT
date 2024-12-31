import { Request, Response } from 'express';
import Course from "../SOFTWAREPROJECT/models/Course";
import Quiz from "../SOFTWAREPROJECT/models/Quizzes";
import ResponseModel from "../SOFTWAREPROJECT/models/Responses";
import User from "../SOFTWAREPROJECT/models/User"; // Import the User model

export const getInstructorAnalytics = async (req: Request, res: Response) => {
    try {
        const { instructorId } = req.params;

        // Fetch instructor details
        const instructor = await User.findById(instructorId); // Assuming there's a User model
        if (!instructor) {
            return res.status(404).json({ error: "Instructor not found" });
        }

        // Fetch courses created by the instructor
        const courses = await Course.find({ createdBy: instructorId });

        // Fetch quizzes for the instructor's courses
        const courseIds = courses.map(course => course._id);
        const quizzes = await Quiz.find({ courseId: { $in: courseIds } });

        // Fetch responses for quizzes
        const quizIds = quizzes.map(quiz => quiz._id);
        const quizResponses = await ResponseModel.find({ quizId: { $in: quizIds } });

        // Aggregate analytics
        const studentEngagement = await ResponseModel.aggregate([
            { $match: { quizId: { $in: quizIds } } },
            { $group: { _id: "$userId", quizzesAttempted: { $sum: 1 }, avgScore: { $avg: "$score" } } },
        ]);

        const contentEffectiveness = await ResponseModel.aggregate([
            { $match: { quizId: { $in: quizIds } } },
            { $group: { _id: "$quizId", avgScore: { $avg: "$score" } } },
        ]);

        // Send instructor details along with analytics data
        res.json({
            instructorName: instructor.name,
            instructorEmail: instructor.email,
            instructorRole: instructor.role,
            studentEngagement,
            contentEffectiveness,
        });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};

