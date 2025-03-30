import { formatApiResponse } from "../helpers/bodyResponse.js";
import { logger } from '../helpers/logger.js';
import { searchOnMultipleEngines } from "../services/researcher.js";
import { getRawSiteWithLyrics } from "../services/rawSiteWithLyrics.js";
import { getOnlyTheLyric } from "../helpers/extractLyric.js";

interface FullLyric {
    status: number;
    message: string;
    fullLyric: {
        title: string;
        artist: string;
        lyric: string;
    }
}

export async function getLyric(query: string): Promise<FullLyric | null> {
    try {
        //return await searchOnMultipleEngines(query + ' gospel site:letras.mus.br');
        const link = await searchOnMultipleEngines(query + ' site:letras.mus.br');
        if (!link) {
            logger.warn('Link não encontrado');
            return formatApiResponse({
                status: 404,
                message: 'Letra não encontrada',
                fullLyric: { title: '', artist: '', lyric: '' },
            });
        }

        const html = await getRawSiteWithLyrics(link);
        if (!html) {
            logger.warn('html bruto não encontrado:', html);
            return formatApiResponse({
                status: 404,
                message: 'Letra não encontrada',
                fullLyric: { title: '', artist: '', lyric: '' },
            });
        }
        const { title, artist, lyric } = await getOnlyTheLyric(html);
        return formatApiResponse({
            status: 200,
            message: 'Letra encontrada com sucesso',
            fullLyric: { title, artist, lyric },
        });
    } catch (error) {
        logger.error('Erro ao ler o arquivo:', error);
        return formatApiResponse({
            status: 500,
            message: 'Houve um erro ao processar a letra: ' + error,
            fullLyric: { title: '', artist: '', lyric: '' },
        });
    }
}
