import express, { Router, Request, Response } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import { errorHandler, validationFilter, validationUUID } from './middleware/middleware.js';
import { getLyric } from './api/get_lyric.js';
import { logger } from './helpers/logger.js';
import { findMusic, findMusicById } from './music/findMusic.js';
////////////
// apenas para exemplo do body backend
// PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
//const arrayOfLyric: any = [];
type LyricArray = Array<{
    id: string;
    title: string;
    artist: string;
    author: string;
    lyrics: string;
    path: string
}>;
///////////
const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 8080) : 9999;

const app = express();
const apiRouter = Router();

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use(bodyParser.json());
app.use('/v1/lyrics', apiRouter);


apiRouter.get('/search', validationFilter, async (req, res) => {
    const text = typeof req?.query?.text === 'string' ? req?.query?.text : '';
    const title = typeof req?.query?.title === 'string' ? true : false;
    const artist = typeof req?.query?.artist === 'string' ? true : false;
    const lyrics = typeof req?.query?.lyrics === 'string' ? true : false;

    await findMusic({ text, title, artist, lyrics }).then((response: object | null) => {
        if (response) {
            // Se a música for encontrada, retorna ela
            res.status(200).json(response).end();
        } else {
            // Se a musica nao for encontrada, retorna erro 404
            res.status(404).json({ message: 'Música nao encontrada' }).end();
        }
    }).catch((error: any) => {
        // Se ocorrer um erro, retorna erro 500
        logger.error('Erro ao buscar a musica:');
        logger.error(error);
        res.status(500).json({ message: 'Erro ao buscar a musica' }).end();
    });

    /*
    await getLyric(text as string).then((response: LyricArray) => {
        arrayOfLyric.push(...response);
        res.status(201).json(
            response
        ).end();
    }).catch(() => {
        res.status(422).end();
    });
    */
});


apiRouter.get('/get', validationUUID, async (req: Request, res: Response): Promise<void> => {
    const id = typeof req?.query?.id === 'string' ? req?.query?.id : undefined;
    if (!id) {
        res.status(422).json({ message: 'UUID inválido.' }).end();
        return;
    }
    try {
        const response = await findMusicById(id);
        if (response) {
            res.status(200).json(response).end();
        } else {
            res.status(404).json({ message: 'Música não encontrada' }).end();
        }
    } catch (error: any) {
        // Se ocorrer um erro, retorna erro 500
        logger.error('Erro ao buscar a musica:', error);
        res.status(500).json({ message: 'Erro ao buscar a musica' }).end();
    }
});


app.use(errorHandler);

const numForks = Number(process.env.CLUSTER_WORKERS) || 1;

if (cluster.isPrimary && process.env.CLUSTER === 'true') {
    logger.info(`index.js: Primary ${process.pid} is running`);

    for (let i = 0; i < numForks; i++) {
        cluster.fork();
    }

    cluster.on('exit', (worker, code, signal) => {
        logger.info(`index.js: worker ${worker.process.pid} died: code ${code} signal ${signal}`);
    });
} else {
    const serverApp = app.listen(PORT, () => {
        logger.info(`index.js:${process.pid}:Listening on ${PORT}`);
    });

    if (process.env.USE_TIMEOUT === 'true') {
        serverApp.setTimeout(TIMEOUT);
        logger.info(`Starting with timeout as ${TIMEOUT}ms`);

        serverApp.on('timeout', (socket) => {
            logger.warn(`Timing out connection`);
            socket.end();
        });
    }
}

