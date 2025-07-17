import { getLyric } from "../searchLyric/getByText.js";
import { mySqliteMusic } from "../database/sqlite.js";
import { logger } from "../helpers/logger.js";
import { Lyric, QueryLyric } from "../types/music.js";

export class Music {
    public static async searchByText({ req, res }: any): Promise<object | null | any> {
        const text = req?.query['text'] as string;
        const title = req?.query['title'] === 'true';
        const artist = req?.query['artist'] === 'true';
        const author = req?.query['author'] === 'true';
        const lyrics = req?.query['lyrics'] === 'true';

        const query: QueryLyric = {
            text,
            title,
            artist,
            author,
            lyrics,
        };
        // Pesquisa a letra no banco de dados
        const searchMusicDatabase = await findMusic(query);
        // Se a letra for encontrada no banco de dados, retorna a letra
        if (searchMusicDatabase !== null) {
            res.status(200).json(searchMusicDatabase).end();
            logger.info('Música encontrada no banco de dados: ' + text);
        } else {
            // Se a letra não for encontrada no banco de dados local, pesquisa nos motores de busca
            await getLyric(text as string).then((response: Lyric) => {
                // Salvando a letra no banco de dados local
                const newMusic = new mySqliteMusic();
                newMusic.save(response);
                // retornando a letra
                res.status(201).json(
                    [response]
                ).end();
            }).catch(() => {
                res.status(422).end();
            });
        }
    }

    public static async insert(id: string): Promise<object | null> {
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

    public static async findById({ req, res }: any): Promise<object | null> {
        const id = req?.query?.id as string;
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

}

function findMusic(query: QueryLyric) {
    throw new Error("Function not implemented.");
}
