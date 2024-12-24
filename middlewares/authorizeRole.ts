import { Request, Response, NextFunction } from 'express';

interface User {
    role: string;
}

interface RequestWithUser extends Request {
    user: User;
}

const authorizeRole = (roles: string[]) => {
    return async (req: RequestWithUser, res: Response, next: NextFunction): Promise<any> => {
        // Check if the user has the correct role
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Access denied. Insufficient permissions." });
        }
        
        next();
    };
};

export default authorizeRole;
