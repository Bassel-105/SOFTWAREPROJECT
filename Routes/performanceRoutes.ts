import { Router, Request, Response } from 'express';
import { getStudentDashboard } from '../Controllers/studentController';
import { getInstructorAnalytics } from '../Controllers/instructorController';

const router: Router = Router();

// Route for student dashboard
router.get('/student-dashboard/:studentId', async (req: Request, res: Response): Promise<any> => {
    return getStudentDashboard(req, res);
});

// Route for instructor analytics
router.get('/instructor-analytics/:instructorId', async (req: Request, res: Response): Promise<any> => {
    return getInstructorAnalytics(req, res);
});

export default router;