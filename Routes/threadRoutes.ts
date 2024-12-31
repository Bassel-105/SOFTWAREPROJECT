// routes/threadsRoutes.ts
import express from 'express';
import { createThread, getThreadsByCourse, searchThreads,deleteThread} from '../Controllers/threadController'; // Import the controller functions

const router = express.Router();

// Create a new thread
router.post('/', createThread);

// Get threads for a specific course
router.get('/:courseId', getThreadsByCourse);

// Search threads by title or content
router.get('/search/:courseId', searchThreads);
router.delete('/:id', deleteThread); 

export default router;