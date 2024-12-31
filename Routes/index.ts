import { Express } from 'express';
import authRoutes from './authRoutes';
import courseRoutes from './courseRoutes';
//import quizRoutes from './quizRoutes';
//import moduleRoutes from './moduleRoutes';

export default (app: Express): void => {
    app.use('/auth', authRoutes);
    app.use('/courses', courseRoutes);
    
};
