import { Document, Model } from 'mongoose';
import User from './User'; // Import User model to get biometric data

// Define the User interface
interface IUser extends Document {
    email: string;
    biometricData: string;
}

// Function to verify biometric data
async function verifyBiometricData(username: string, capturedImage: string): Promise<boolean> {
    try {
        // Retrieve stored biometric data for the user
        const user: IUser | null = await User.findOne({ email: username }) as IUser | null;
        const storedBiometricData: string | null = user ? user.biometricData : null;

        if (!storedBiometricData) {
            console.log('No biometric data found for this user.');
            return false; // No biometric data found
        }

        console.log('Stored Biometric Data:', storedBiometricData);
        console.log('Captured Biometric Image:', capturedImage);

        // Compare captured image with stored biometric data
        const isMatch: boolean = await compareImages(storedBiometricData, capturedImage);

        // Return true if biometric data matches
        return isMatch;
    } catch (error) {
        console.error('Error during biometric verification:', error);
        return false; // In case of any error
    }
}

// Placeholder for image comparison logic (can use face-api.js on the server or TensorFlow)
async function compareImages(storedImage: string, capturedImage: string): Promise<boolean> {
    // Implement actual image comparison logic here (e.g., using face-api.js, TensorFlow)
    // For now, we'll simulate a match (replace this with actual logic)
    return storedImage === capturedImage;
}

export { verifyBiometricData };
