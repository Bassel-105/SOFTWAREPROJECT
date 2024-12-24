import express, { Request, Response } from 'express';
import { loginUser } from '../Controllers/authController';

const router = express.Router();

// Define the POST route for login
router.post('/login', async (req: Request, res: Response) => {
    await loginUser(req, res);
});

export default router;
