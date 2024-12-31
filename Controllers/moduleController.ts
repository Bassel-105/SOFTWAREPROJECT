import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Module from '../SOFTWAREPROJECT/models/module';
import Course from '../SOFTWAREPROJECT/models/Course';
import User, { IUser } from '../SOFTWAREPROJECT/models/User'; // Make sure to import User model

export const createModule = async (req: Request, res: Response): Promise<void> => {
    const { title, description, difficultyLevel, courseId } = req.body;

    // Cast req to a type that includes the user property
    const user = (req as Request & { user?: IUser }).user;

    console.log("Authenticated User:", user); // Log the user object to check

    if (!user) {
        res.status(401).json({ message: 'Unauthorized, user not found' });
        return; // Ensure the function exits after sending the response
    }

    // Validate the required fields
    if (!title || !description || !difficultyLevel || !courseId) {
        res.status(400).json({ message: 'All fields (title, description, difficultyLevel, courseId) are required' });
        return; // Ensure the function exits after sending the response
    }

    try {
        // Find the course to associate the module with
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return; // Ensure the function exits after sending the response
        }

        // Log the user query to check if user is found
        console.log("Searching for user with userId:", user.userId);

        // Find the user in the database
        const foundUser = await User.findOne({ userId: user.userId }); // Querying by userId
        if (!foundUser) {
            res.status(401).json({ message: 'Unauthorized, user not found in database' });
            return; // Ensure the function exits after sending the response
        }

        console.log("User found:", foundUser); // Log the found user object

        // Generate a unique moduleId (could be auto-generated or custom)
        const moduleId = new mongoose.Types.ObjectId(); // Generate a new ObjectId for moduleId

        // Create the module
        const newModule = new Module({
            moduleId: moduleId.toString(), // Ensure moduleId is a string (if your schema expects a string)
            title,
            description,
            difficultyLevel,
            courseId: course._id,
            createdBy: foundUser._id,  // Use foundUser._id
        });

        // Save the module to the database
        await newModule.save();

        // Now update the course to add the new module
        await Course.findByIdAndUpdate(
            courseId, 
            { $push: { modules: newModule._id } }, // Push the module ID into the modules array
            { new: true } // Return the updated course
        );

        // Send the response back with the created module
        res.status(201).json({ message: 'Module created successfully', data: newModule });
    } catch (error: unknown) {
        console.error('Error during module creation:', error);

        // Cast error to Error type
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error occurred' });
        }
    }
};

export const getModules = async (req: Request, res: Response): Promise<void> => {
    const { courseId } = req.params; // Get the courseId from the request parameters
    const { avgScore } = req.params; // Get avgScore from the request parameters

    // Convert avgScore to a number
    const avgScoreNum = 0; 

    // Check if avgScore is a valid number
    if (isNaN(avgScoreNum)) {
        res.status(400).json({ message: 'Invalid avgScore' });
        return;
    }

    let lvl = "";

    // Determine the difficulty level based on avgScore
    if (avgScoreNum > 20) {
        lvl = "All"; // Special case to fetch all modules
    } else if (avgScoreNum > 10) {
        lvl = "Advanced";
    } else if (avgScoreNum > 5) {
        lvl = "Intermediate";
    } else {
        lvl = "Beginner";
    }

    // Validate the courseId
    if (!mongoose.Types.ObjectId.isValid(courseId)) {
        res.status(400).json({ message: 'Invalid courseId' });
        return;
    }

    try {
        // Find the course by courseId to ensure it exists
        const course = await Course.findById(courseId);
        if (!course) {
            res.status(404).json({ message: 'Course not found' });
            return;
        }

        let modules;

        // Fetch modules based on the level
        if (lvl === "All") {
            // Fetch all modules for the course
            modules = await Module.find({ courseId: course._id });
        } else {
            // Fetch modules for the specific difficulty level
            modules = await Module.find({ courseId: course._id, difficultyLevel: lvl });
        }

        if (modules.length === 0) {
            res.status(404).json({ message: 'No modules found for this course' });
            return;
        }

        // Send the modules as the response
        res.status(200).json({ message: 'Modules fetched successfully', modules });
    } catch (error: unknown) {
        console.error('Error fetching modules:', error);

        // Handle error properly
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error occurred' });
        }
    }
};

export const updateModule = async (req: Request, res: Response): Promise<void> => {
    const { moduleId } = req.params; // Extract moduleId from the request parameters
    const { title, description, difficultyLevel, userId } = req.body; // Extract module details and userId from the request body

    console.log("User ID from request body:", userId); // Log the user ID from the request body

    // Validate the required fields
    if (!moduleId || (!title && !description && !difficultyLevel)) {
        res.status(400).json({ message: 'Module ID and at least one field (title, description, difficultyLevel) are required' });
        return; // Ensure the function exits after sending the response
    }

    try {
        // Validate moduleId
        if (!mongoose.Types.ObjectId.isValid(moduleId)) {
            res.status(400).json({ message: 'Invalid moduleId' });
            return;
        }

        // Find the module by ID
        const module = await Module.findById(moduleId);
        if (!module) {
            res.status(404).json({ message: 'Module not found' });
            return;
        }

        // Validate userId
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            res.status(400).json({ message: 'Invalid userId' });
            return;
        }

        // Find the user in the database using `_id`
        const foundUser = await User.findById(userId);
        if (!foundUser) {
            res.status(401).json({ message: 'Unauthorized, user not found in database' });
            return;
        }

        console.log("User found:", foundUser); // Log the found user object

        // Check if the user is the creator of the module or has an instructor role
        if (module.createdBy.toString() !== foundUser.id.toString() && foundUser.role !== 'instructor') {
            res.status(403).json({ message: 'Forbidden: You do not have permission to update this module' });
            return;
        }

        // Update the module fields if provided
        if (title) module.title = title;
        if (description) module.description = description;
        if (difficultyLevel) module.difficultyLevel = difficultyLevel;

        // Save the updated module
        const updatedModule = await module.save();

        // Send the response back with the updated module
        res.status(200).json({ message: 'Module updated successfully', data: updatedModule });
    } catch (error: unknown) {
        console.error('Error updating module:', error);

        // Cast error to Error type
        if (error instanceof Error) {
            res.status(500).json({ message: 'Server error', error: error.message });
        } else {
            res.status(500).json({ message: 'Server error', error: 'Unknown error occurred' });
        }
    }
};

