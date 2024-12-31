import express from 'express';
import { createQuestionBank, addQuestionsToBank, updateQuestion,deleteQuestion ,getQuestions} from '../Controllers/questionbackController';

const router = express.Router();

// Route to create a new question bank for a module
router.post('/create', createQuestionBank);

// Route to add questions to a question bank
router.post('/add-questions/:questionBankId', addQuestionsToBank);
router.put('/update/:questionBankId/:questionId', updateQuestion);

// Route to delete a question from the question bank
router.delete('/delete/:questionBankId/:questionId', deleteQuestion);
router.get('/getQuestions/:questionBankId', getQuestions);


export default router;