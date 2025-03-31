import * as cheerio from 'cheerio';
import { logger } from '../helpers/logger.js';

export async function getOnlyTheLyrics(html: string | null): Promise<{ title: string, artist: string, lyrics: string }> {
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
        let lyrics = letraContainer.html();

        if (!lyrics) {
            throw new Error('Letra nao encontrada');
        }

        // Substituir <br> por \n
        lyrics = lyrics.replace(/<br\s*\/?>/gi, '\n');

        // Substituir <p> por \n\n
        lyrics = lyrics.replace(/<\/?p[^>]*>/gi, '\n');

        // Remover tags restantes
        lyrics = lyrics.replace(/<\/?[^>]+(>|$)/g, '');

        lyrics = lyrics.trim();
        return { title, artist, lyrics };

    } catch (error: any) {
        logger.error('Erro ao processar a letra:');
        logger.error(error.message);
        return { title: '', artist: '', lyrics: '' };
    }
}