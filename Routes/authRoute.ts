import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import FailedLogin from '../SOFTWAREPROJECT/models/FailedLogin';
import User from '../SOFTWAREPROJECT/models/User'; // Assuming you have a User model

const router = express.Router();


router.post('/login', async (req: Request, res: Response): Promise<void> => {
  const { username, password } = req.body;

  try {
    const user = await User.findOne({ username });

    if (!user) {
      // Log failed attempt
      const failedLogin = new FailedLogin({
        username,
        ip: req.ip,
      });
      await failedLogin.save(); // Use save() instead of create()
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      // Log failed attempt
      const failedLogin = new FailedLogin({
        username,
        ip: req.ip,
      });
      await failedLogin.save(); // Use save() instead of create()
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate JWT Token
    const token = jwt.sign({ userId: user._id, username: user.email }, 'secret', { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error: unknown) {
    // Type assertion to handle the error
    if (error instanceof Error) {
      console.error(error.message); // Access the error message
      res.status(500).json({ message: 'Server error', error: error.message });
    } else {
      console.error('Unknown error occurred');
      res.status(500).json({ message: 'Server error', error: 'Unknown error' });
    }
  }
});
export default router;
