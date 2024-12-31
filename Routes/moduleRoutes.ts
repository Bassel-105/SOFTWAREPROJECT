import express from 'express';
import { createModule, getModules } from '../Controllers/moduleController';
import authenticateToken from '../middlewares/authMiddleware'; // Ensure only instructors can access this
import { Request, Response } from "express";
import mongoose from "mongoose";
import Course from "../SOFTWAREPROJECT/models/Course"; // Ensure Course model is correctly imported
import User from "../SOFTWAREPROJECT/models/User"; // Ensure User model is correctly imported
import {searchCourses,createCourse} from "../Controllers/courseController"
import Module from "../SOFTWAREPROJECT/models/module"
import {updateModule} from "../Controllers/moduleController"

const router = express.Router();

// Route for instructors to create a module
router.post('/create', authenticateToken, createModule);
router.get('/getModules/:courseId', getModules);
router.put('/modules/:moduleId', updateModule); 



router.delete("/modules/:moduleId", async (req: Request, res: Response): Promise<any> => {
    try {
        const { moduleId } = req.params;

        // Find and delete the module by its _id
        const deletedModule = await Module.findByIdAndDelete(moduleId);

        if (!deletedModule) {
            return res.status(404).json({ message: "Module not found" });
        }

        res.status(200).json({ message: "Module deleted successfully" });
    } catch (err) {
        console.error("Error deleting module:", err);
        res.status(500).json({ message: "Error deleting module", error: (err as Error).message });
    }
});





export default router;