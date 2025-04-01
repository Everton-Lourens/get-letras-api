import { mySqliteMusic } from "../database/sqlite.js";
import { logger } from "../helpers/logger.js";

export async function insertMusic(id: string): Promise<object | null> {
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