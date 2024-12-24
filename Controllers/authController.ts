import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { Request, Response } from 'express';
import User from '../SOFTWAREPROJECT/models/User';

interface IUser {
  _id: string;
  email: string;
  password: string;
  role: string;
}

const loginUser = async (req: Request, res: Response): Promise<Response> => {
  const { email, password }: { email: string; password: string } = req.body;

  try {
    console.log('Login attempt with email:', email);
    console.log('Entered password:', password);  // Log the entered password

    // Check if user exists
    const user = await User.findOne<IUser>({ email });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }
    console.log('User found:', user.email);  // Log the user email for confirmation

    // Validate password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('Stored hashed password:', user.password);  // Log the stored hashed password
    console.log('Password comparison result:', isPasswordValid);  // Log the result of bcrypt.compare

    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    console.log('Password validation successful');

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET as string, {
      expiresIn: '1h',
    });

    // Log JWT token
    console.log('JWT Token:', token);

    return res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export { loginUser };
