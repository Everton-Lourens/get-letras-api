import express, { Router } from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import cluster from 'cluster';
import process from 'process';
import { errorHandler, validationFilter } from './middleware/middleware.js';
import { getLyric } from './api/get_lyric.js';
import { logger } from './helpers/logger.js';
////////////
// apenas para exemplo do body backend
// PESSIMAS PRÁTICAS: SALVANDO EM MEMÓRIA APENAS PARA EXEMPIFICAR O BODY DO BACKEND
const lastJsonBody: any = [];
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

/////////////////////////
// Rota de teste
apiRouter.get('/', (req, res) => {
    getLyric('fernandinho seu sangue').then((response) => {
        res.status(201).json({
            messageAlert: 'Operação realizada com sucesso',
            data: response
        }).end();
    }).catch(() => {
        res.status(422).end();
    });
});


apiRouter.post('/', validationFilter, (req, res) => {
    getLyric('fernandinho seu sangue').then((response) => {
        res.status(201).json({
            messageAlert: 'Operação realizada com sucesso',
            data: response
        }).end();
    }).catch(() => {
        res.status(422).end();
    });
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

