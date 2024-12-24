import { Request, Response, NextFunction } from 'express';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { RequestWithUser } from '../middlewares/RequestWithUser';

const authenticateToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Access denied. No token provided." });
    return; // Ensure the function ends here
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as JwtPayload;

    // Log decoded token for debugging
    console.log("Decoded token:", decoded);

    // Cast req as RequestWithUser to add the `user` property
    (req as RequestWithUser).user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next(); 
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ message: "Invalid or expired token." });
  }
};


export default authenticateToken;
