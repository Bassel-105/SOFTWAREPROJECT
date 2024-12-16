const express = require("express");
const { Course } = require("./models");
const app = express();
app.use(express.json());

app.post("/api/courses", async (req, res) => {
    const { courseId, title, description, category, difficultyLevel, createdBy } = req.body;

    try {
        const course = new Course({ courseId, title, description, category, difficultyLevel, createdBy });
        await course.save();
        res.status(201).json(course);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const { Module } = require("./models");

app.post("/api/modules", async (req, res) => {
    const { moduleId, courseId, title, content, hierarchyOrder } = req.body;

    try {
        const module = new Module({ moduleId, courseId, title, content, hierarchyOrder });
        await module.save();
        res.status(201).json(module);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

const { VersionHistory } = require("./models");

app.put("/api/modules/:id", async (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;

    try {
        const module = await Module.findById(id);
        if (!module) return res.status(404).json({ error: "Module not found" });

        // Save version history
        const version = (await VersionHistory.countDocuments({ moduleId: id })) + 1;
        const versionHistory = new VersionHistory({ moduleId: id, version, content: module.content });
        await versionHistory.save();

        // Update the module
        module.title = title || module.title;
        module.content = content || module.content;
        module.updatedAt = new Date();
        await module.save();

        res.json(module);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

app.get("/api/search/courses", async (req, res) => {
    const { q } = req.query;

    try {
        const courses = await Course.find({
            $or: [
                { title: { $regex: q, $options: "i" } },
                { description: { $regex: q, $options: "i" } }
            ],
        });
        res.json(courses);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
