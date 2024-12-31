import { Request, Response } from 'express';
import mongoose from 'mongoose';
import QuestionBank from '../SOFTWAREPROJECT/models/questionbank';
import Module from '../SOFTWAREPROJECT/models/module';
import Question from '../SOFTWAREPROJECT/models/question';
import Course from '../SOFTWAREPROJECT/models/Course';

// Controller to create a Question Bank for a module
export const createQuestionBank = async (req: Request, res: Response): Promise<any> => {
    const { title, difficultyLevel, moduleId,courseId } = req.body;

    // Validate the required fields
    if (!title || !difficultyLevel || !moduleId) {
        res.status(400).json({ message: 'All fields (title, difficultyLevel, moduleId) are required' });
        return; // Ensure the function exits after sending the response
    }

    // Validate moduleId format
    if (!mongoose.Types.ObjectId.isValid(moduleId)) {
        return res.status(400).json({ message: 'Invalid module ID' });
    }

    try {
        // Find the module to associate the question bank with
        console.log("Searching for module with ID:", moduleId);
        const module = await Module.findById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return; // Ensure the function exits after sending the response
        }
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return; // Ensure the function exits after sending the response
        }
        // Log the module found
        console.log("Module found:", module);

        // Create a new Question Bank
        const newQuestionBank = new QuestionBank({
            title,
            moduleId: module._id,
            questions: [],
            difficultyLevel,
            courseId: course._id
        });

        // Save the question bank to the database
        await newQuestionBank.save();

        // Update the module to reference the new question bank
        module.questionBankId = newQuestionBank._id as mongoose.Types.ObjectId;
        await module.save();

        // Send response with the created question bank
        res.status(201).json({ message: 'Question bank created successfully', data: newQuestionBank });
    } catch (error: unknown) {
        console.error('Error during question bank creation:', error);

        // Cast error to Error type for better handling
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error occurred' });
        }
    }
};




export const addQuestionsToBank = async (req: Request, res: Response): Promise<void> => {
    const { question, options, correctAnswer, difficultyLevel, questionType } = req.body;
    const { questionBankId } = req.params;

    try {
        // Create a new question document
        const newQuestion = new Question({
            question,
            options,
            correctAnswer,
            difficultyLevel,
            questionType,
        });

        // Save the question to the database
        await newQuestion.save();

        // Find the Question Bank by its ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            res.status(404).json({ message: 'Question Bank not found' });
            return;
        }

        // Add the new question to the Question Bank's questions array
        questionBank.questions.push(newQuestion._id as mongoose.Types.ObjectId);  // Explicit cast to ObjectId
        await questionBank.save();

        // Send success response
        res.status(200).json({ message: 'Question added to Question Bank', data: newQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

export const updateQuestion = async (req: Request, res: Response): Promise<void> => {
    const { questionBankId, questionId } = req.params;
    const { question, options, correctAnswer, difficultyLevel, questionType } = req.body;

    try {
        // Find the Question Bank by its ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            res.status(404).json({ message: 'Question Bank not found' });
            return;
        }

        // Find the question by its ID within the question bank
        const existingQuestion = await Question.findById(questionId);  // Correct reference to the Question model
        if (!existingQuestion) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        // Update the question details
        existingQuestion.question = question || existingQuestion.question;
        existingQuestion.options = options || existingQuestion.options;
        existingQuestion.correctAnswer = correctAnswer || existingQuestion.correctAnswer;
        existingQuestion.difficultyLevel = difficultyLevel || existingQuestion.difficultyLevel;
        existingQuestion.questionType = questionType || existingQuestion.questionType;

        // Save the updated question
        await existingQuestion.save();

        // Send the response back with the updated question
        res.status(200).json({ message: 'Question updated successfully', data: existingQuestion });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
// Controller to delete a question from a question bank
export const deleteQuestion = async (req: Request, res: Response): Promise<void> => {
    const { questionBankId, questionId } = req.params;

    try {
        // Find the Question Bank by its ID
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            res.status(404).json({ message: 'Question Bank not found' });
            return;
        }

        // Find and remove the question from the database
        const question = await Question.findByIdAndDelete(questionId);
        if (!question) {
            res.status(404).json({ message: 'Question not found' });
            return;
        }

        // Cast question._id to ObjectId and remove it from the Question Bank's questions array
        questionBank.questions = questionBank.questions.filter(
            (questionId) => questionId.toString() !== (question._id as mongoose.Types.ObjectId).toString()
        );
        await questionBank.save();

        // Send the response back confirming deletion
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


export const getQuestions = async (req: Request, res: Response): Promise<void> => {
    const { questionBankId } = req.params; // Correct the typo in `questionBankId`

    try {
        // Find the question bank by ID and populate the questions field
        const questionBank = await QuestionBank.findById(questionBankId).populate('questions');

        if (!questionBank || !questionBank.questions || questionBank.questions.length === 0) {
            res.status(404).json({ message: 'No questions found for this bank.' });
            return;
        }

        res.status(200).json({ questions: questionBank.questions });
    } catch (error) {
        console.error('Error fetching questions:', error);
        res.status(500).json({ message: 'Server error' });
    }
};