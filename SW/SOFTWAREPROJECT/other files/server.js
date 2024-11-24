const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config(); // Load environment variables from .env file

const app = express();

app.use(express.json());

// Connect to MongoDB without the deprecated options
mongoose
    .connect("mongodb://localhost:27017/DB1")
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => console.error("MongoDB connection error:", err));

app.get("/", (req, res) => {
    res.send("Hello, world!");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
