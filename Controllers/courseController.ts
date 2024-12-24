import { Request, Response, NextFunction } from "express";
import Course, { ICourse } from "../SOFTWAREPROJECT/models/Course"; // Import the ICourse interface and Course model

export const createCourse = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const course: ICourse = new Course(req.body);  // Type the course object as ICourse
        await course.save();
        return res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        next(err);
        return res.status(500).json({ message: "Internal Server Error" }); // Add a return statement for error handling
    }
};

// Update a course
export const updateCourse = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            req.body,
            { new: true }
        );
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json({ message: "Course updated successfully", course });
    } catch (err) {
        next(err);
        return res.status(500).json({ message: "Internal Server Error" }); // Ensure a return statement
    }
};

// Get a specific course
export const getCourse = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId });
        if (!course) return res.status(404).json({ message: "Course not found" });
        return res.status(200).json(course);
    } catch (err) {
        next(err);
        return res.status(500).json({ message: "Internal Server Error" }); // Add a return for error handling
    }
};

// Search courses
export const searchCourses = async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
    try {
        const courses = await Course.find({
            title: new RegExp(req.query.q as string, "i"),
        });
        return res.status(200).json(courses);
    } catch (err) {
        next(err);
        return res.status(500).json({ message: "Internal Server Error" }); // Handle error
    }
};