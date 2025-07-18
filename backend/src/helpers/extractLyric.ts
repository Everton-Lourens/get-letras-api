import * as cheerio from 'cheerio';
import { logger } from '../helpers/logger.js';
import { formatLyric, simpleFormatLyrics } from './format.js';

export async function getOnlyTheLyrics(html: string | null, fullFormatLyrics = false): Promise<{ title: string, artist: string, lyrics: string }> {
    try {
        if (!html) {
            throw new Error('HTML vazio');
        }
        const $ = cheerio.load(html);
        const titleElement = $('title');
        const titleName = titleElement.text();
        const titleAndArtist = titleName.replace(' - LETRAS.MUS.BR', '');

        const splitTitleAndArtist = titleAndArtist.split(' - ');

        const title = splitTitleAndArtist[0];
        const artist = splitTitleAndArtist[1];

        // Selecionar o elemento que contém a letra da música
        const rawLyricHtml = $('.lyric-original');

        // Extrair o texto bruto da letra
        let rawLyric = rawLyricHtml.html();

        if (!rawLyric)
            throw new Error('Letra não encontrada');

        rawLyric = simpleFormatLyrics(rawLyric)
        var lyrics = fullFormatLyrics ? formatLyric(rawLyric) : rawLyric;

        return { title, artist, lyrics };

    } catch (error: any) {
        logger.error('Erro ao processar a letra:');
        logger.error(error.message);
        return { title: '', artist: '', lyrics: '' };
    }
}

