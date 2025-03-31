import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import { errorHandler, validationFilter } from './middleware/middleware.js';
import { getLyric } from './api/get_lyric.js';
import { logger } from './helpers/logger.js';
import { ParsedQs } from 'qs';
////////////
// apenas para exemplo do body backend
// PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
const arrayOfLyric: any = [];
type LyricArray = Array<{
    id: string;
    title: string;
    artist: string;
    author: string;
    lyrics: string;
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
    const text = req?.query?.text;

    await getLyric(text as string).then((response: LyricArray) => {
        arrayOfLyric.push(...response);
        res.status(201).json(
            response
        ).end();
    }).catch(() => {
        res.status(422).end();
    });
});


apiRouter.get('/get', (req, res) => {
    // Pega o parâmetro 'id' da URL
    const { id } = req.query;

    console.log('ID recebido:', id);

    // Busca pela música com o ID fornecido
    const song = arrayOfLyric.find((song: { id: string | ParsedQs | (string | ParsedQs)[] | undefined; }) => song.id === id);
    // Se encontrar a música, retorna ela; se não, retorna erro 404
    if (song) {
        res.status(200).json(song).end();
    } else {
        res.status(404).json({ message: 'Música não encontrada' }).end();
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

