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

  async getMusic({ id }: { id: string }) {
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
  }

  async getTitle({ id }: { id: string }) {
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
  }

  async getAuthor({ id }: { id: string }) {
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
  }

  async getArtist({ id }: { id: string }) {
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
  }

  async getPath({ id }: { id: string }) {
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
  }

  async getLyric({ id }: { id: string }) {
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
  }
}