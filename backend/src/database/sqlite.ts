import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { logger } from '../helpers/logger.js';

export class mySqliteMusic {
  private db: Database | undefined;

  private async initDB() {
    this.db = await open({
      filename: './local_db/music.db',
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

  async getMusicByQuery({ text, title = false, artist = false, lyrics = false }: {
    text: string;
    title?: boolean;
    artist?: boolean;
    lyrics?: boolean;
  }) {
    try {
      await this.initDB();
      if (!this.db) {
        logger.warn('Database not initialized.');
        return;
      }

      const query = `SELECT * FROM songs WHERE ${title ? 'title LIKE ?' : ''} ${artist ? 'OR artist LIKE ?' : ''} ${lyrics ? 'OR lyrics LIKE ?' : ''}`;
      const params: string[] = [];
      if (title) params.push(`${text}%`);
      if (artist) params.push(`${text}%`);
      if (lyrics) params.push(`${text}%`);
      const songs = await this.db.all(query, params);
      if (!songs.length) {
        logger.info(`Música com texto "${text}" não encontrada`);
        return;
      }
      logger.info(`Música com texto "${text}" encontrada: ${songs.map(song => song.title).join(', ')}`);
      await this.closeDB();
      return songs;
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