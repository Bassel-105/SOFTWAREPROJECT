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

// server.js

const express = require('express');
const bodyParser = require('body-parser');
const { verifyBiometricData } = require('./biometricService'); // Biometric verification logic

const app = express();
app.use(bodyParser.json());

// Login route - Capture biometric after login credentials
app.post('/login', async (req, res) => {
    const { username, password, biometricImage } = req.body;

    // Logic to authenticate username and password
    const isAuthenticated = await authService.login(username, password);
    if (!isAuthenticated) {
        return res.status(401).json({ message: 'Login failed' });
    }

    // Verify biometric data
    const isBiometricVerified = await verifyBiometricData(username, biometricImage);
    if (!isBiometricVerified) {
        return res.status(401).json({ message: 'Biometric verification failed' });
    }

    return res.status(200).json({ message: 'Login successful' });
});

// Exam route - Capture biometric before entering the exam
app.post('/start-exam', async (req, res) => {
    const { username, biometricImage } = req.body;

    // Verify biometric data
    const isBiometricVerified = await verifyBiometricData(username, biometricImage);
    if (!isBiometricVerified) {
        return res.status(401).json({ message: 'Biometric verification failed' });
    }

    return res.status(200).json({ message: 'Exam started successfully' });
});




app.get("/", (req, res) => {
    res.send("Hello, world!");
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
