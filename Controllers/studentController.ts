import { Request, Response } from 'express';
import Course from "../SOFTWAREPROJECT/models/Course";
import Quiz from "../SOFTWAREPROJECT/models/Quizzes"; // Import the Quiz model
import ResponseModel from "../SOFTWAREPROJECT/models/Responses";

// Student Dashboard
export const getStudentDashboard = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;

    // Fetch enrolled courses
    const courses = await Course.find({ enrolledStudents: studentId });

    // Fetch quizzes for the enrolled courses
    const courseIds = courses.map(course => course._id); // Array of course IDs
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } });

    // Fetch responses for quizzes
    const quizResponses = await ResponseModel.find({ userId: studentId });

    // Calculate metrics
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizResponses.length;
    const averageScore = quizResponses.reduce((sum, r) => sum + r.score, 0) / quizResponses.length || 0;

    // Engagement trends
    const engagementTrends = await ResponseModel.aggregate([
      { $match: { userId: studentId } },
      { $group: { _id: { month: { $month: "$submittedAt" } }, count: { $sum: 1 } } },
    ]);

    res.json({
      totalQuizzes,
      completedQuizzes,
      courseCompletionRate: (completedQuizzes / totalQuizzes) * 100,
      averageScore,
      engagementTrends,
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};