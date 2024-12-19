const User = require('./User'); // Import User model to get biometric data

async function verifyBiometricData(username, capturedImage) {
    try {
        // Retrieve stored biometric data for the user
        const user = await User.findOne({ email: username });
        const storedBiometricData = user ? user.biometricData : null;

        if (!storedBiometricData) {
            console.log('No biometric data found for this user.');
            return false; // No biometric data found
        }

        console.log('Stored Biometric Data:', storedBiometricData);
        console.log('Captured Biometric Image:', capturedImage);

        // Compare captured image with stored biometric data
        const isMatch = await compareImages(storedBiometricData, capturedImage);

        // Return true if biometric data matches
        return isMatch;
    } catch (error) {
        console.error('Error during biometric verification:', error);
        return false; // In case of any error
    }
}

// Placeholder for image comparison logic (can use face-api.js on the server or TensorFlow)
async function compareImages(storedImage, capturedImage) {
    // Implement actual image comparison logic here (e.g., using face-api.js, TensorFlow)
    // For now, we'll simulate a match (replace this with actual logic)
    if (storedImage === capturedImage) {
        return true; // Images match
    }
    return false; // Images do not match
}

module.exports = {
    verifyBiometricData,
};
