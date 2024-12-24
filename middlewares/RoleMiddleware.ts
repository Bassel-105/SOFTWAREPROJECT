import { Response, NextFunction } from 'express';
import { RequestWithUser } from './RequestWithUser'; // Ensure you import the correct interface

// Middleware to check if the user's role matches the required role(s)
const roleMiddleware = (allowedRoles: string[]) => {
  return (req: RequestWithUser, res: Response, next: NextFunction) => {
    const userRole = req.user?.role; 

    if (!userRole) {
      return res.status(403).json({ message: "Access denied. No role found." });
    }

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied. You do not have the required role." });
    }

    next(); // If the role matches, proceed to the next middleware or route handler
  };
};

export default roleMiddleware;
