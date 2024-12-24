import { Router, Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import Quiz from '../SOFTWAREPROJECT/models/Quizzes'; // Assuming you have a Quiz model
import { RequestWithUser } from '../middlewares/RequestWithUser'; // Import the custom RequestWithUser type
import { Types } from 'mongoose';

// Middleware to authenticate and check role
const authenticateToken = (requiredRole: string | string[]) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    const token = req.header("Authorization")?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Access denied. No token provided." });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as { userId: string, email: string, role: string };

      // Attach user to the request object
      (req as RequestWithUser).user = {
        userId: decoded.userId,
        email: decoded.email,
        role: decoded.role,
      };

      // Check if the user's role matches the required role(s)
      if (Array.isArray(requiredRole)) {
        if (!requiredRole.includes(decoded.role)) {
          return res.status(403).json({ message: "Forbidden: Insufficient permissions." });
        }
      } else if (decoded.role !== requiredRole) {
        return res.status(403).json({ message: "Forbidden: Insufficient permissions." });
      }

      next();
    } catch (error) {
      res.status(401).json({ message: "Invalid or expired token." });
    }
  };
};

const router = Router();

// Route for creating a quiz (only accessible by instructors)
router.post(
  '/create',
  authenticateToken('instructor'), // Ensure the user is authenticated and has 'instructor' role
  async (req: Request, res: Response): Promise<any> => { // Use RequestWithUser here
    const { title, courseId, questions, passingScore } = req.body;

    if (!title || !courseId || !questions || !passingScore) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const newQuiz = new Quiz({
      title,
      courseId: new Types.ObjectId(courseId),
      questions,
      passingScore,
    });

    try {
      const savedQuiz = await newQuiz.save();
      res.status(201).json(savedQuiz);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: 'Error creating quiz', error: err.message });
      } else {
        res.status(500).json({ message: 'Unknown error occurred', error: 'Unknown error' });
      }
    }
  }
);

// Route for getting all quizzes (accessible by students and instructors)
router.get('/all', authenticateToken(['student', 'instructor']), async (req: Request, res: Response): Promise<any> => { // Use RequestWithUser here
  try {
    const quizzes = await Quiz.find();
    res.status(200).json(quizzes);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error fetching quizzes', error: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred', error: 'Unknown error' });
    }
  }
});

// Route for getting a single quiz by ID (accessible by students and instructors)
router.get('/:quizId', authenticateToken(['student', 'instructor']), async (req: Request, res: Response): Promise<any> => { // Use RequestWithUser here
  const { quizId } = req.params;

  try {
    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }
    res.status(200).json(quiz);
  } catch (err: unknown) {
    if (err instanceof Error) {
      res.status(500).json({ message: 'Error fetching quiz', error: err.message });
    } else {
      res.status(500).json({ message: 'Unknown error occurred', error: 'Unknown error' });
    }
  }
});

// Route for updating a quiz (only accessible by instructors)
router.put(
  '/:quizId',
  authenticateToken('instructor'), // Ensure the user is authenticated and has 'instructor' role
  async (req: Request, res: Response): Promise<any> => { // Use RequestWithUser here
    const { quizId } = req.params;
    const { title, courseId, questions, passingScore } = req.body;

    try {
      const updatedQuiz = await Quiz.findByIdAndUpdate(
        quizId,
        { title, courseId, questions, passingScore },
        { new: true }
      );

      if (!updatedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      res.status(200).json(updatedQuiz);
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: 'Error updating quiz', error: err.message });
      } else {
        res.status(500).json({ message: 'Unknown error occurred', error: 'Unknown error' });
      }
    }
  }
);

// Route for deleting a quiz (only accessible by instructors)
router.delete(
  '/:quizId',
  authenticateToken('instructor'), // Ensure the user is authenticated and has 'instructor' role
  async (req: Request, res: Response): Promise<any> => { // Use RequestWithUser here
    const { quizId } = req.params;

    try {
      const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

      if (!deletedQuiz) {
        return res.status(404).json({ message: 'Quiz not found' });
      }

      res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (err: unknown) {
      if (err instanceof Error) {
        res.status(500).json({ message: 'Error deleting quiz', error: err.message });
      } else {
        res.status(500).json({ message: 'Unknown error occurred', error: 'Unknown error' });
      }
    }
  }
);

export default router;
