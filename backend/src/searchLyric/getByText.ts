import { logger } from '../helpers/logger.js';
import { v4 as uuid } from 'uuid';
import { searchOnMultipleEngines } from "../services/researcher.js";
import { getRawSiteWithLyrics } from "../services/rawSiteWithLyrics.js";
import { getOnlyTheLyrics } from "../helpers/extractLyric.js";
import { Lyric } from '../types/music.js';

export async function getLyric(text: string): Promise<Lyric> {
    try {
        // Consulta a letra no google ou qualquer outro motor de busca e pega o primeiro link do site "letras.mus.br"
        // Se o texto tiver algum caractere especial, remove e adiciona "site:letras.mus.br" para melhorar a busca
        const link = await searchOnMultipleEngines(text.replace(/[@!#$%&*_={};]/g, '') + ' site:letras.mus.br');
        if (!link) {
            logger.warn('Link não encontrado');
            return errorResponse();
        }
        // Faz a requisição para o site "letras.mus.br" e pega o html bruto com a letra
        const html = await getRawSiteWithLyrics(link);
        if (!html) {
            logger.warn('html bruto não encontrado:', html);
            return errorResponse();
        }
        // Se na consulta tiver "@", então a letra é formatada com 4 linhas para melhorar a leitura da letra
        // caso contrário, a letra fica da forma como está no site:
        const fullFormatLyrics = text.includes('@') ? true : false;
        // Extrai a letra de música do html que veio do site "letras.mus.br" e retorna um objeto com as informações da música
        const { title, artist, lyrics } = await getOnlyTheLyrics(html, fullFormatLyrics);
        // Checa se o título ou a letra foram encontrados
        // Se não foram encontrados, retorna um objeto vazio
        if (!title || !lyrics) {
            logger.warn('Título ou letra não encontrados');
            return errorResponse();
        }
        const newMusic = {
            id: uuid(),
            title,
            artist,
            author: artist,
            lyrics,
            path: '', // Aqui você pode adicionar o caminho da música caso salve no servidor o MP3
        }
        // Dado tudo certo, retorna um array com um objeto contendo as informações da música
        return newMusic;

    } catch (error) {
        logger.error('Erro ao ler o arquivo:', error);
        return errorResponse();
    }
    function errorResponse() {
        return {
            id: '',
            title: '',
            artist: '',
            author: '',
            lyrics: '',
            path: '',
        };
    }
}
