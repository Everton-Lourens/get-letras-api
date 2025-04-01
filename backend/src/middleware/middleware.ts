import { Request, Response, NextFunction } from 'express';
import _ from 'lodash';
import { validate, v4 as uuid } from 'uuid';
import { logger } from '../helpers/logger.js';

export const validateBody = (req: Request): boolean => {
    try {
        const { text, title, artist, lyrics } = req.query;
        console.log('Parâmetros recebidos:', { text, title, artist, lyrics });

        if (!text || typeof text !== 'string' || text.trim() === '') return false;

        return true;
    } catch (error) {
        return false;
    }
};

export const validationFilter = (req: Request, res: Response, next: NextFunction): void => {
    try {
        if (!validateBody(req)) {
            logger.error('Erro de validação do corpo da requisição:', req.query);
            // Type 'Response<any, Record<string, any>>' is not assignable to type 'void'
            res.status(422).json({ message: 'Dados inválidos no corpo da requisição.' });
            return;
        }
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const validationUUID = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const { id } = req?.query;
        if (!id || !validate(id)) {
            logger.error('Erro de validação do UUID:', id);
            res.status(422).json({ message: 'UUID inválido.' });
            return;
        }
        console.info('ID recebido:', id);
        next();
    } catch (error) {
        logger.error(error);
        res.status(500).json({ message: 'Erro interno no servidor. Tente novamente mais tarde.' });
    }
};

export const errorHandler = (err: any, req: Request, res: Response, _: NextFunction): void => {
    res.status(err.status || 500).end();
};

