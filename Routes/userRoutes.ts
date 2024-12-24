import { Router, Request, Response } from 'express';
import { enrollInCourse } from '../Controllers/userController';

const router: Router = Router();

// Route to enroll in a course
router.post('/enroll', async (req: Request, res: Response): Promise<any> => {
    return enrollInCourse(req, res);
});

export default router;
