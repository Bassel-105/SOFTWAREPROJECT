import { Request, Response, RequestHandler } from 'express';
import mongoose from 'mongoose';
import Course from '../SOFTWAREPROJECT/models/Course';
import QuestionBank from '../SOFTWAREPROJECT/models/questionbank';
import User from '../SOFTWAREPROJECT/models/User'; // Assuming you have a User model



export const createCourse = async (req: Request, res: Response): Promise<any> => {
    const { courseId, title, description, category, difficultyLevel, createdBy, keywords, questionBankId } = req.body;

    // Validate the required fields
    if (!courseId || !title || !description || !createdBy || !keywords || !questionBankId) {
        res.status(400).json({ message: 'All fields (courseId, title, description, createdBy, keywords, questionBankId) are required' });
        return;
    }

    // Validate createdBy format (must be a valid ObjectId)
    if (!mongoose.Types.ObjectId.isValid(createdBy)) {
        return res.status(400).json({ message: 'Invalid createdBy ID format' });
    }

    // Validate questionBankId format (must be a valid ObjectId)
    // if (!mongoose.Types.ObjectId.isValid(questionBankId)) {
    //     return res.status(400).json({ message: 'Invalid questionBankId format' });
    // }

    try {
        // Find the instructor to associate with the course (createdBy must be an instructor)
        const instructor = await User.findById(createdBy);
        if (!instructor) {
            res.status(404).json({ message: 'Instructor not found' });
            return;
        }

        // Ensure the user is an instructor
        if (instructor.role !== 'instructor') {
            res.status(403).json({ message: 'Only instructors can create courses' });
            return;
        }

        // Find the question bank to associate with the course
        const questionBank = await QuestionBank.findById(questionBankId);
        if (!questionBank) {
            res.status(404).json({ message: 'Question bank not found' });
            return;
        }

        // Create a new course and associate the question bank
        const newCourse = new Course({
            courseId,
            title,
            description,
            category,
            difficultyLevel,
            createdBy,  // Store the instructor's ID
            keywords,
            questionBank: questionBank._id,  // Link the QuestionBank ID
        });

        // Save the new course to the database
        await newCourse.save();

        // Send response with the created course
        res.status(201).json({ message: 'Course created successfully', data: newCourse });
    } catch (error) {
        console.error('Error during course creation:', error);

        // Cast error to Error type for better handling
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error occurred' });
        }
    }
};



// Get all courses
export const getCourses: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    try {
        const courses = await Course.find();
        res.status(200).json({ message: 'Courses fetched successfully', data: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Get a course by its ID
export const getCourseById: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    try {
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json({ message: 'Course fetched successfully', data: course });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};



export const updateCourse: RequestHandler = async (req, res): Promise<any> => {
    const { courseId } = req.params;
    const { courseCode, title, description, category, difficultyLevel, keywords } = req.body; 


    try {
        // Find the course by the MongoDB _id (courseId in URL parameter)
        const course = await Course.findById({_id:courseId});

        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        
        if (course.courseId !== courseCode) {
            return res.status(400).json({ message: 'courseCode mismatch' });
        }

        // Update the course details using the MongoDB _id (courseId from URL)
        const updatedCourse = await Course.findByIdAndUpdate(
            {_id:courseId},  // Use the MongoDB _id from the URL
            { title, description, category, difficultyLevel, keywords },
            { new: true }  // Return the updated course
        );

        if (!updatedCourse) {
            return res.status(404).json({ message: 'Course not found' });
        }

        res.status(200).json({ message: 'Course updated successfully', data: updatedCourse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};


// Delete a course by its ID
export const deleteCourse: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params;

    try {
        const deletedCourse = await Course.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }
        res.status(200).json({ message: 'Course deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search Courses (by title or keyword)
export const searchCourses: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query; // Search term (e.g., title or keyword)

    // Ensure query is a string before proceeding
    if (typeof query !== 'string') {
        res.status(400).json({ message: 'Invalid search query' });
        return;
    }

    try {
        const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

        const courses = await Course.find({
            $or: [
                { title: { $regex: searchRegex } },
                { keywords: { $in: [searchRegex] } },
            ],
        });

        if (courses.length === 0) {
            res.status(404).json({ message: 'No courses found matching the search criteria' });
            return;
        }

        res.status(200).json({ message: 'Courses fetched successfully', data: courses });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search Students (Instructors can search students by name, email, or student ID)
export const searchStudents: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query; // Search term (e.g., name, email, student ID)

    // Ensure query is a string before proceeding
    if (typeof query !== 'string') {
        res.status(400).json({ message: 'Invalid search query' });
        return;
    }

    try {
        const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

        const students = await User.find({
            role: 'student', // Ensure only students are returned
            $or: [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
                { studentId: { $regex: searchRegex } },
            ],
        });

        if (students.length === 0) {
            res.status(404).json({ message: 'No students found matching the search criteria' });
            return;
        }

        res.status(200).json({ message: 'Students fetched successfully', data: students });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

// Search Instructors (Students can search instructors by name or email)
export const searchInstructors: RequestHandler = async (req: Request, res: Response): Promise<void> => {
    const { query } = req.query; // Search term (e.g., name, email)

    // Ensure query is a string before proceeding
    if (typeof query !== 'string') {
        res.status(400).json({ message: 'Invalid search query' });
        return;
    }

    try {
        const searchRegex = new RegExp(query, 'i'); // Case-insensitive search

        const instructors = await User.find({
            role: 'instructor', // Ensure only instructors are returned
            $or: [
                { name: { $regex: searchRegex } },
                { email: { $regex: searchRegex } },
            ],
        });

        if (instructors.length === 0) {
            res.status(404).json({ message: 'No instructors found matching the search criteria' });
            return;
        }

        res.status(200).json({ message: 'Instructors fetched successfully', data: instructors });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
