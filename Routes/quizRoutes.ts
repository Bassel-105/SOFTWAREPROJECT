import express from 'express';
import { createQuiz,getQuiz,deleteQuiz} from '../Controllers/quizController';

const router = express.Router();

// Route to create a new quiz
router.post('/create', createQuiz);
router.get('/getQuiz/:moduleId', getQuiz);
router.delete('/deleteQuiz/:quizId', deleteQuiz);

export default router;