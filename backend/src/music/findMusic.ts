import { mySqliteMusic } from "../database/sqlite.js";
import { logger } from "../helpers/logger.js";
import { QueryLyric } from "../types/music.js";

export async function findMusic({ text, title, artist, author, lyrics }: QueryLyric): Promise<object | null> {

    const findMusic = new mySqliteMusic();

    return findMusic.getMusicByQuery({ text, title, artist, author, lyrics }).then((response) => {
        if (response) {
            // Se a música for encontrada, retorna ela
            return response;
        } else {
            // Se a música não for encontrada, retorna erro 404
            return null;
        }
    }).catch((error) => {
        // Se ocorrer um erro, retorna erro 500
        logger.error('Erro ao buscar a música:', error);
        return null;
    });
}

export async function findMusicById(id: string): Promise<object | null> {
    const findMusic = new mySqliteMusic();
    return findMusic.getMusic({ id }).then((response) => {
        if (response) {
            // Se a música for encontrada, retorna ela
            return response;
        } else {
            // Se a música não for encontrada, retorna erro 404
            return null;
        }
    }).catch((error) => {
        // Se ocorrer um erro, retorna erro 500
        logger.error('Erro ao buscar a música:', error);
        return null;
    });
}