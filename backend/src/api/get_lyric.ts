import { formatApiResponse } from "../helpers/bodyResponse.js";
import { logger } from '../helpers/logger.js';
import { validate, v4 as uuid } from 'uuid';
import { searchOnMultipleEngines } from "../services/researcher.js";
import { getRawSiteWithLyrics } from "../services/rawSiteWithLyrics.js";
import { getOnlyTheLyrics } from "../helpers/extractLyric.js";

interface Array<T> {
    status: number;
    message: string;
    fullLyric: {
        title: string;
        artist: string;
        lyrics: string;
    }
}

export async function getLyric(query: string): Promise<any> {
    try {
        //return await searchOnMultipleEngines(query + ' gospel site:letras.mus.br');
        const link = await searchOnMultipleEngines(query + ' site:letras.mus.br');
        if (!link) {
            logger.warn('Link não encontrado');
            return [{
                id: '',
                title: '',
                artist: '',
                author: '',
                lyrics: '',
            }];
        }

        const html = await getRawSiteWithLyrics(link);
        if (!html) {
            logger.warn('html bruto não encontrado:', html);
            return [{
                id: '',
                title: '',
                artist: '',
                author: '',
                lyrics: '',
            }];
        }
        const { title, artist, lyrics } = await getOnlyTheLyrics(html);
        return [{
            id: uuid(),
            title,
            artist,
            author: artist,
            lyrics,
        }];
    } catch (error) {
        logger.error('Erro ao ler o arquivo:', error);
        return [{
            id: '',
            title: '',
            artist: '',
            author: '',
            lyrics: '',
        }];
    }
}
