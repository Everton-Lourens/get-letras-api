import { Request, Response, NextFunction } from 'express';
import { mySqliteMusic } from "../database/sqlite.js";
import { logger } from "../helpers/logger.js";

declare global {
    namespace Express {
        interface Request {
            music?: object | null;
            foundMusic?: boolean;
        }
    }
}

export const findMusicMiddleware = (req: Request, res: Response, next: NextFunction): void => {
    try {
        const id = typeof req?.query?.id === 'string' ? req.query.id : undefined;
        if (!id) {
            req.foundMusic = false;
            return next();
        }
        const findInSqlite = new mySqliteMusic();

        findInSqlite.getMusic({ id }).then((response: object | null) => {
            req.music = response; // Anexa a música ao objeto req para outras funções usarem
            req.foundMusic = true;
        }).catch((error: any) => {
            // Se ocorrer um erro, retorna erro 500
            logger.error('Erro ao buscar a musica:', error);
            req.foundMusic = false;
        });
    } catch (error) {
        logger.error('Erro ao validar o UUID:', error);
        req.foundMusic = false;
    }
    next();
}