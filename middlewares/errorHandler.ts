import { Request, Response, NextFunction } from 'express';

interface CustomError extends Error {
    status?: number;
}

const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction): void => {
    console.error(err);
    res.status(err.status || 500).json({ error: err.message || "Internal Server Error" });
};

export default errorHandler;
