import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger.js';

export const validateBody = (req: Request): boolean => {
    try {
        const { id, auth } = req?.body;

        if (!validate(id)) return false;

        if (typeof auth !== 'string') return false;

        return true;
    } catch (error) {
        return false;
    }
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!validateBody(req)) {
            logger.error('Erro de validação do corpo da requisição:', req.body);
            // Type 'Response<any, Record<string, any>>' is not assignable to type 'void'
            res.status(422).json({ message: 'Dados inválidos no corpo da requisição.' });
            return;
        }
        if (!req?.body?.auth) {
            req.body.id = uuid();
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    res.status(err.status || 500).end();
};

