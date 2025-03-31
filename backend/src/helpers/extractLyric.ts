import * as cheerio from 'cheerio';
import { logger } from '../helpers/logger.js';

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

        if (!rawLyric) {
            throw new Error('Letra nao encontrada');
        }

        const lyrics = fullFormatLyrics ? formatFullLyrics(rawLyric) : simpleFormatLyrics(rawLyric);

        return { title, artist, lyrics };

    } catch (error: any) {
        logger.error('Erro ao processar a letra:');
        logger.error(error.message);
        return { title: '', artist: '', lyrics: '' };
    }
}

function simpleFormatLyrics(lyrics: string): string {
    // Remover tags HTML
    // Substituir <br> por \n
    lyrics = lyrics.replace(/<br\s*\/?>/gi, '\n');

    // Substituir <p> por \n\n
    lyrics = lyrics.replace(/<\/?p[^>]*>/gi, '\n');

    // Remover tags restantes
    lyrics = lyrics.replace(/<\/?[^>]+(>|$)/g, '');

    lyrics = lyrics.trim();
    return lyrics;
}

function formatFullLyrics(lyrics: string): string {

    lyrics = simpleFormatLyrics(lyrics);

    // Formatar letras para 17 caracteres por linha sem cortar palavras
    const words = lyrics.split(/\s+/);
    let currentLine = '';
    const formattedLines = [];

    words.forEach(word => {
        if ((currentLine + ' ' + word).trim().length <= 30) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            formattedLines.push(currentLine);
            currentLine = word;
        }
    });
    if (currentLine) formattedLines.push(currentLine);

    // Agrupar em blocos de 4 linhas
    const groupSize = 4;
    const formattedLyrics = [];
    for (let i = 0; i < formattedLines.length; i += groupSize) {
        for (let j = 0; j < groupSize; j++) {
            if (i + j < formattedLines.length) {
                formattedLyrics.push(formattedLines[i + j]);
            } else {
                formattedLyrics.push(' '.repeat(30));
            }
        }
        formattedLyrics.push(''); // Adicionar espaçamento entre blocos
    }

    lyrics = formattedLyrics.join('\n').trim();

    return lyrics;
}