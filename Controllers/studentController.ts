import { Request, Response } from 'express';
import User from "../SOFTWAREPROJECT/models/User"; // Import the User model
import Course from "../SOFTWAREPROJECT/models/Course";
import Quiz from "../SOFTWAREPROJECT/models/Quizzes"; // Import the Quiz model
import ResponseModel from "../SOFTWAREPROJECT/models/Responses";

// Instructor Analytics Endpoint
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

// Student Dashboard Endpoint
export const getStudentDashboard = async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = req.params;

    // Fetch user details using userId
    const user = await User.findOne({ userId });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    if (user.role !== "student") {
      return res.status(403).json({ error: "Access denied. User is not a student." });
    }

    // Fetch enrolled courses
    const courses = await Course.find({ enrolledStudents: user._id });

    // Fetch quizzes for the enrolled courses
    const courseIds = courses.map((course) => course._id);
    const quizzes = await Quiz.find({ courseId: { $in: courseIds } });

    // Fetch responses for quizzes
    const quizResponses = await ResponseModel.find({ userId: user._id });

    // Calculate metrics
    const totalQuizzes = quizzes.length;
    const completedQuizzes = quizResponses.length;
    const averageScore = quizResponses.reduce((sum, r) => sum + r.score, 0) / quizResponses.length || 0;

    // Engagement trends
    const engagementTrends = await ResponseModel.aggregate([
      { $match: { userId: user._id } },
      { $group: { _id: { month: { $month: "$submittedAt" } }, count: { $sum: 1 } } },
    ]);

    res.json({
      userId: user.userId,
      name: user.name,
      email: user.email,
      role: user.role,
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
