// Função de Distância de Levenshtein
export function levenshtein(a: any, b: any) {
    if (!a.length) return b.length;
    if (!b.length) return a.length;
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1
                );
            }
        }
    }
    return matrix[b.length][a.length];
}




import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { logger } from '../helpers/logger.js';
import { levenshtein } from './levenshtein.js';

export class mySqliteMusic {
  private db: Database | undefined;

  private async initDB() {
    this.db = await open({
      filename: './music.db',
      driver: sqlite3.Database
    });

    await this.db.exec(`
            CREATE TABLE IF NOT EXISTS songs (
                id TEXT PRIMARY KEY,
                title TEXT,
                author TEXT,
                artist TEXT,
                lyrics TEXT,
                path TEXT
            )
        `);
  }


  private async closeDB() {
    if (this.db) {
      await this.db.close();
      this.db = undefined;
    }
  }

  async save({ id, title, author, artist, lyrics, path }:
    { id: string; title: string; author: string; artist: string; lyrics: string; path: string }) {
    await this.initDB();

    if (!this.db) {
      logger.warn('Database not initialized.');
      return false;
    }
    try {
      await this.db.run('INSERT INTO songs (id, title, author, artist, lyrics, path) VALUES (?, ?, ?, ?, ?, ?)',
        [id, title, author, artist, lyrics, path]);
      logger.info(`Música "${title}" salva com ID "${id}"`);
    } catch (error: any) {
      if (error.code === 'SQLITE_CONSTRAINT') {
        logger.error('A música que você está tentando inserir no banco de dados SQLite já existe.');
      } else if (error.code === 'SQLITE_MISMATCH') {
        logger.error('Um ou mais valores que você está tentando inserir na tabela songs não correspondem aos tipos de dados esperados pela coluna no banco de dados SQLite.');
      } else {
        logger.error('Erro ao salvar música:', error.message);
      }
      await this.closeDB();
      return false;
    }
    await this.closeDB();
    return true;
  }

  async getMusicByQuery({ text, title = false, artist = false, author = false, lyrics = false }: {
    text: string;
    title?: boolean;
    artist?: boolean;
    author?: boolean;
    lyrics?: boolean;
  }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
  
      const conditions = [];
      const params: string[] = [];
  
      if (title) {
        conditions.push('title LIKE ?');
        params.push(`${text}%`);
      }
      if (artist) {
        conditions.push('artist LIKE ?');
        params.push(`${text}%`);
      }
      if (author) {
        conditions.push('author LIKE ?');
        params.push(`${text}%`);
      }
      if (lyrics) {
        conditions.push('lyrics LIKE ?');
        params.push(`${text}%`);
      }
  
      if (conditions.length === 0) {
        logger.warn('Nenhum campo de busca foi selecionado.');
        return;
      }
  
      const query = `SELECT * FROM songs WHERE ${conditions.join(' OR ')}`;
      const songs = await this.db.all(query, params);
  
      if (!songs.length) {
        logger.info(`Música com texto "${text}" não encontrada`);
        return;
      }
  
      // Ordenar os resultados pela menor distância de Levenshtein
      const rankedSongs = songs.map(song => ({
        ...song,
        similarity: Math.min(
          title ? levenshtein(text, song.title) : Infinity,
          artist ? levenshtein(text, song.artist) : Infinity,
          author ? levenshtein(text, song.author) : Infinity,
          lyrics ? levenshtein(text, song.lyrics) : Infinity
        )
      })).sort((a, b) => a.similarity - b.similarity); // Ordena por similaridade (quanto menor, melhor)
  
      logger.info(`Músicas encontradas ordenadas por similaridade: ${rankedSongs.map(song => song.title).join(', ')}`);
      await this.closeDB();
      return rankedSongs;
  
    } catch (error) {
      logger.error('Erro no banco de dados local: getMusicByQuery()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }
  

  async getMusic({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT * FROM songs WHERE id = ?', [id]);
      if (!song) {
        logger.info(`Música com ID "${id}" não encontrada`);
        return;
      }
      logger.info(`Música com ID "${id}": ${song.title} - ${song.artist}`);
      await this.closeDB();
      return song;
    } catch (error) {
      logger.error('Erro no banco de dados local: getMusic()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }

  async getTitle({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT title FROM songs WHERE id = ?', [id]);
      if (!song || !song.title) {
        logger.info(`Título da música com ID "${id}" não encontrado`);
        return;
      }
      logger.info(`Título da música com ID "${id}": ${song.title}`);
      await this.closeDB();
      return song.title;
    } catch (error) {
      logger.error('Erro no banco de dados local: getTitle()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }

  async getAuthor({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT author FROM songs WHERE id = ?', [id]);
      if (!song || !song.author) {
        logger.info(`Autor da música com ID "${id}" não encontrado`);
        return;
      }
      logger.info(`Autor da música com ID "${id}": ${song.author}`);
      await this.closeDB();
      return song.author;
    } catch (error) {
      logger.error('Erro no banco de dados local: getAuthor()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }

  async getArtist({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT artist FROM songs WHERE id = ?', [id]);
      if (!song || !song.artist) {
        logger.info(`Artista da música com ID "${id}" não encontrado`);
        return;
      }
      logger.info(`Artista da música com ID "${id}": ${song.artist}`);
      await this.closeDB();
      return song.artist;
    } catch (error) {
      logger.error('Erro no banco de dados local: getArtist()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }

  async getPath({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT path FROM songs WHERE id = ?', [id]);
      if (!song || !song.path) {
        logger.info(`Caminho da música com ID "${id}" não encontrado`);
        return '';
      }
      logger.info(`Caminho da música com ID "${id}": ${song.path}`);
      await this.closeDB();
      return song.path;
    } catch (error) {
      logger.error('Erro no banco de dados local: getPath()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }

  async getLyric({ id }: { id: string }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }
      const song = await this.db.get('SELECT lyrics FROM songs WHERE id = ?', [id]);
      if (!song || !song.lyrics) {
        logger.info(`Letra da música com ID "${id}" não encontrada`);
        return;
      }
      logger.info(`Letra da música "${id}":\n${song.lyrics.substring(0, 10)}`);
      await this.closeDB();
      return song.lyrics;
    } catch (error) {
      logger.error('Erro no banco de dados local: getLyric()');
      logger.error(error);
      await this.closeDB();
      return;
    }
  }
}