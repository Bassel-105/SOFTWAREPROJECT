const Course = require("../models/Course");

// Create a new course
exports.createCourse = async (req, res, next) => {
    try {
        const course = new Course(req.body);
        await course.save();
        res.status(201).json({ message: "Course created successfully", course });
    } catch (err) {
        next(err);
    }
};

// Update a course
exports.updateCourse = async (req, res, next) => {
    try {
        const course = await Course.findOneAndUpdate(
            { courseId: req.params.courseId },
            req.body,
            { new: true }
        );
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json({ message: "Course updated successfully", course });
    } catch (err) {
        next(err);
    }
};

// Get a specific course
exports.getCourse = async (req, res, next) => {
    try {
        const course = await Course.findOne({ courseId: req.params.courseId });
        if (!course) return res.status(404).json({ message: "Course not found" });
        res.status(200).json(course);
    } catch (err) {
        next(err);
    }
};

// Search courses
exports.searchCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({
            title: new RegExp(req.query.q, "i"),
        });
        res.status(200).json(courses);
    } catch (err) {
        next(err);
    }
};
