import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';

const validateQuiz = (req: Request, res: Response, next: NextFunction): void => {
    const schema = Joi.object({
        quizId: Joi.string().required(),
        moduleId: Joi.string().required(),
        questions: Joi.array()
            .items(
                Joi.object({
                    questionId: Joi.string().required(),
                    text: Joi.string().required(),
                    options: Joi.array().items(Joi.string().required()).min(2).required(),
                    answer: Joi.string().required(),
                })
            )
            .required(),
    });

    const { error } = schema.validate(req.body);
    if (error) {
        return res.status(400).json({ message: error.details[0].message });
    }

    next();
};

export default validateQuiz;
