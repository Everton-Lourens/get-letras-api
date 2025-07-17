import { Request, Response } from 'express'
import { Lyric, QueryLyric } from '../types/music.js'
import { getLyricByText } from '../api/get_lyric.js';
import { mySqliteMusic } from '../database/sqlite.js';
import { findMusic, findMusicById } from '../music/findMusic.js';
import { logger } from '../helpers/logger.js';

export class MusicController {

  async getLyric(req: Request, res: Response): Promise<Response> {
    const text = req?.query['text'] as string;
    if (!text) return res.status(422).json({ message: 'Texto da música não informado' }).end();

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
      logger.info('Música encontrada no banco de dados: ' + text);
      return res.status(200).json(searchMusicDatabase).end();
    } else {
      try {
        // Se a letra não for encontrada no banco de dados local, pesquisa nos motores de busca
        const response: Lyric = await getLyricByText(text as string);
        // Salvando a letra no banco de dados local
        const newMusic = new mySqliteMusic();
        newMusic.save(response);
        // retornando a letra
        return res.status(201).json([response]).end();
      } catch (error) {
        return res.status(422).end();
      }
    }
  }

  async getLyricById(req: Request, res: Response): Promise<Response> {
    const id = req?.query?.id as string;
    if (!id) return res.status(422).json({ message: 'Id da música não informado' }).end();
    try {
      const response = await findMusicById(id);
      if (response) {
        return res.status(200).json(response).end();
      } else {
        return res.status(404).json({ message: 'Música não encontrada' }).end();
      }
    } catch (error: any) {
      // Se ocorrer um erro, retorna erro 500
      logger.error('Erro ao buscar a musica:', error);
      return res.status(500).json({ message: 'Erro ao buscar a musica' }).end();
    }
  }
}
