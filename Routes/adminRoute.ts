import express, { Request, Response } from 'express';
import FailedLogin from '../SOFTWAREPROJECT/models/FailedLogin';
import AuditLog from '../SOFTWAREPROJECT/models/AuditLogs';

const router = express.Router();

// Get failed login attempts
router.get('/failedlogins', async (req: Request, res: Response): Promise<void> => {
  try {
    const failedLogins = await FailedLogin.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(failedLogins);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching failed login attempts' });
  }
});

// Get audit logs
router.get('/audit', async (req: Request, res: Response): Promise<void> => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(10);
    res.status(200).json(logs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching audit logs' });
  }
});

export default router;
