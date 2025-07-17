import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger.js';

export const validateBody = (req: Request): boolean => {
    if (!req?.query['text']) return false;

    const { text } = req.query;
    if (!text || typeof text !== 'string' || text.trim() === '') return false;

    return true;
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!validateBody(req)) {
            logger.error('Erro de validação do corpo da requisição:');
            logger.error(req.query);
            // Type 'Response<any, Record<string, any>>' is not assignable to type 'void'
            res.status(422).json({ message: 'Dados inválidos no corpo da requisição.' });
            return;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
        next(error);
    }
};

export const validationUUID = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!req?.query['id']) {
            res.status(422).json({ message: 'UUID não encontrado na requisição.' });
            return;
        }

        const { id } = req?.query;
        if (!id || !validate(id)) {
            logger.error('Erro de validação do UUID:', id);
            res.status(422).json({ message: 'UUID inválido.' });
            return;
        }
        logger.info('ID recebido para consulta no banco de dados:', id);
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    res.status(err.status || 500).end();
};

