import * as cheerio from 'cheerio';
import { logger } from '../helpers/logger.js';

export async function getOnlyTheLyric(html: string | null): Promise<{ title: string, artist: string, lyric: string }> {
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
        const letraContainer = $('.lyric-original');

        // Extrair o texto bruto da letra
        let lyric = letraContainer.html();

        if (!lyric) {
            throw new Error('Letra não encontrada');
        }

        // Substituir <br> por \n
        lyric = lyric.replace(/<br\s*\/?>/gi, '\n');

        // Substituir <p> por \n\n
        lyric = lyric.replace(/<\/?p[^>]*>/gi, '\n');

        // Remover tags restantes
        lyric = lyric.replace(/<\/?[^>]+(>|$)/g, '');

        lyric = lyric.trim();
        return { title, artist, lyric };

    } catch (error) {
        logger.error('Erro ao processar a letra:', error);
        return { title: '', artist: '', lyric: '' };
    }
}