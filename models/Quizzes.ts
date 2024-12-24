import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestion {
    question: string;
    options: string[];
    correctAnswer: string;
}

export interface IQuiz extends Document {
    title: string;
    courseId: mongoose.Types.ObjectId; // The course the quiz is associated with
    questions: IQuestion[];
    passingScore: number; // Percentage of correct answers needed to pass
}

const QuestionSchema = new Schema<IQuestion>({
    question: { type: String, required: true },
    options: { type: [String], required: true },
    correctAnswer: { type: String, required: true }
});

const QuizSchema = new Schema<IQuiz>({
    title: { type: String, required: true },
    courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
    questions: { type: [QuestionSchema], required: true },
    passingScore: { type: Number, required: true }
});

const Quiz = mongoose.model<IQuiz>('Quiz', QuizSchema);
export default Quiz;
