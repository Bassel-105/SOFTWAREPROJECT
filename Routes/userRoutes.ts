import { Router, Request, Response } from "express";
import {
    enrollInCourse,
    updateUserProfile,
    getEnrolledCourses,
    completeCourse,
    getUserProgress,
} from "../Controllers/userController";

const router: Router = Router();

// Route to enroll in a course
router.post("/enroll", async (req: Request, res: Response): Promise<any> => {
    return enrollInCourse(req, res);
});

// Route to update user profile
router.put("/update-profile", async (req: Request, res: Response): Promise<any> => {
    return updateUserProfile(req, res);
});

// Route to get enrolled courses
router.get("/enrolled-courses", async (req: Request, res: Response): Promise<any> => {
    return getEnrolledCourses(req, res);
});

// Route to mark a course as completed
router.post("/complete-course", async (req: Request, res: Response): Promise<any> => {
    return completeCourse(req, res);
});

// Route to get user progress (completed courses and average score)
router.get("/progress", async (req: Request, res: Response): Promise<any> => {
    return getUserProgress(req, res);
});

export default router;