import { Request, Response } from 'express';
import Course from "../SOFTWAREPROJECT/models/Course";
import Quiz from "../SOFTWAREPROJECT/models/Quizzes"; // Import the Quiz model
import ResponseModel from "../SOFTWAREPROJECT/models/Responses";


export const getInstructorAnalytics = async (req: Request, res: Response) => {
    try {
        const { instructorId } = req.params;

        // Fetch courses created by the instructor
        const courses = await Course.find({ createdBy: instructorId });

        // Fetch quizzes for the instructor's courses
        const courseIds = courses.map(course => course._id); // Array of course IDs
        const quizzes = await Quiz.find({ courseId: { $in: courseIds } });

        // Fetch responses for quizzes
        const quizIds = quizzes.map(quiz => quiz._id); // Array of quiz IDs
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

        res.json({ studentEngagement, contentEffectiveness });
    } catch (error: any) {
        res.status(500).json({ error: error.message });
    }
};