import express, { Request, Response, NextFunction } from "express";
import courseRoutes from "./Routes/courseRoutes";
import errorHandler from "./middlewares/errorHandler";

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use("/api/courses", courseRoutes);
  

// Error handling middleware
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  errorHandler(err, req, res, next);
});

export default app;
