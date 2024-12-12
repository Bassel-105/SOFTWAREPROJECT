const express = require("express");
const {
    createCourse,
    updateCourse,
    getCourse,
    searchCourses,
} = require("../controllers/courseController");

const router = express.Router();

// Create a course
router.post("/", createCourse);

// Update a course
router.put("/:courseId", updateCourse);

// Get a specific course
router.get("/:courseId", getCourse);

// Search courses
router.get("/search", searchCourses);

module.exports = router;
