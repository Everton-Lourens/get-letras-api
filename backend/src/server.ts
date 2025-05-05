import express, { Router, Request, Response } from 'express';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import { errorHandler, validationFilter, validationUUID } from './middleware/middleware.js';
import { getLyric } from './api/get_lyric.js';
import { logger } from './helpers/logger.js';
import { findMusic, findMusicById } from './music/findMusic.js';
import { mySqliteMusic } from './database/sqlite.js';

type Lyric = {
    id: string;
    title: string;
    artist: string;
    author: string;
    lyrics: string;
    path: string
};

type QueryLyric = {
    text: string;
    title: boolean;
    artist: boolean;
    author: boolean;
    lyrics: boolean;
};

const TIMEOUT = Number(process.env.REQ_TIMEOUT) || 5000;
const PORT = process.env.NODE_ENV === 'production' ? (Number(process.env.PORT) || 8080) : 9999; // 8080 para usar dentro do docker e 9999 para usar localmente

const app = express();
const apiRouter = Router();

app.use(bodyParser.json());
app.use('/v1/lyrics', apiRouter);


apiRouter.get('/search', validationFilter, async (req, res) => {

    const text = req?.query['text'] as string;
    const title = req?.query['title'] === 'true';
    const artist = req?.query['artist'] === 'true';
    const author = req?.query['author'] === 'true';
    const lyrics = req?.query['lyrics'] === 'true';

    const query: QueryLyric = {
        text,
        title,
        artist,
        author,
        lyrics,
    };

    // Pesquisa a letra no banco de dados
    const searchMusicDatabase = await findMusic(query);
    // Se a letra for encontrada no banco de dados, retorna a letra
    if (searchMusicDatabase !== null) {
        res.status(200).json(searchMusicDatabase).end();
        logger.info('Música encontrada no banco de dados:');
    } else {
        // Se a letra não for encontrada no banco de dados local, pesquisa nos motores de busca
        await getLyric(text as string).then((response: Lyric) => {
            // Salvando a letra no banco de dados local
            const newMusic = new mySqliteMusic();
            newMusic.save(response);
            // retornando a letra
            res.status(201).json(
                [response]
            ).end();
        }).catch(() => {
            res.status(422).end();
        });
    }
});


apiRouter.get('/get', validationUUID, async (req, res) => {
    const id = req?.query?.id as string;

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

