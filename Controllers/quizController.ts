import { Request, Response , RequestHandler} from 'express';
import Quiz from '../SOFTWAREPROJECT/models/Quizzes';
import QuestionBank from '../SOFTWAREPROJECT/models/questionbank';
import mongoose from 'mongoose';
import Course from '../SOFTWAREPROJECT/models/Course';
import Module from '../SOFTWAREPROJECT/models/module';

export const createQuiz: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { title, courseId, passingScore, numberOfQuestions, questionType, moduleId } = req.body;  // Added questionType

    try {
        // Find the course associated with the quiz
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        const module = await Module.findById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }

        // Find the question bank associated with the course and populate the questions
        const questionBank = await QuestionBank.findOne({ courseId: course._id }).populate('questions');
        if (!questionBank) {
            res.status(404).json({ message: 'Question bank not found for this course' });
            return;
        }

        // Filter questions based on the selected questionType
        let filteredQuestions;
        if (questionType === 'MCQ') {
            filteredQuestions = questionBank.questions.filter((q: any) => q.questionType === 'MCQ');
        } else if (questionType === 'True/False') {
            filteredQuestions = questionBank.questions.filter((q: any) => q.questionType === 'True/False');
        } else if (questionType === 'Both') {
            filteredQuestions = questionBank.questions;  // All question types allowed
        } else {
            res.status(400).json({ message: 'Invalid question type' });
            return;
        }

        // Check if enough questions are available
        if (filteredQuestions.length < numberOfQuestions) {
            res.status(400).json({ message: 'Not enough questions available in the question bank' });
            return;
        }

        // Randomly select the required number of questions
        const selectedQuestions = filteredQuestions
            .sort(() => 0.5 - Math.random()) // Randomize the order
            .slice(0, numberOfQuestions); // Select the first 'numberOfQuestions' items

        // Create the quiz
        const newQuiz = new Quiz({
            title,
            courseId: course._id,
            questions: selectedQuestions,
            passingScore,
            numberOfQuestions,
            questionType,  // Store the selected questionType
            moduleId: module._id,
            questionBankId: questionBank._id, // Add the questionBankId here
        });

        // Save the quiz to the database
        await newQuiz.save();

        // Send response without returning the full response object
        res.status(201).json({ message: 'Quiz created successfully', data: newQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
export const getQuiz =async (req: Request, res: Response): Promise<void> => {
    const { moduleId } = req.params; // Assuming moduleId is passed as a URL parameter

    try {
        // Convert moduleId to ObjectId to match the stored ObjectId in MongoDB
        const moduleObjectId = new mongoose.Types.ObjectId(moduleId);

        // Find quizzes by moduleId
        const quizzes = await Quiz.find({ moduleId: moduleObjectId });

        if (!quizzes || quizzes.length === 0) {
            res.status(404).json({ message: 'No quizzes found for this module' });
            return;
        }

        res.status(200).json({ quizzes });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const deleteQuiz: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { quizId } = req.params; // Assuming quizId is passed as a URL parameter

    try {
        // Validate the quizId
        if (!mongoose.Types.ObjectId.isValid(quizId)) {
            res.status(400).json({ message: 'Invalid quiz ID' });
            return;
        }

        // Find and delete the quiz
        const deletedQuiz = await Quiz.findByIdAndDelete(quizId);

        if (!deletedQuiz) {
            res.status(404).json({ message: 'Quiz not found' });
            return;
        }

        res.status(200).json({ message: 'Quiz deleted successfully', deletedQuiz });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

