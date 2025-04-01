import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import { logger } from '../helpers/logger.js';

export class Music {
    private db: Database | undefined;

    constructor() {
        this.initDB().catch(error => {
            logger.error('Erro ao inicializar o banco de dados:', error);
            process.exit(1);
        });
    }

    async initDB() {
        this.db = await open({
            filename: './local_db/music.db',
            driver: sqlite3.Database
        });

        await this.db.exec(`
            CREATE TABLE IF NOT EXISTS songs (
                id INTEGER PRIMARY KEY,
                title TEXT,
                author TEXT,
                artist TEXT,
                lyrics TEXT,
                path TEXT
            )
        `);
    }


    async closeDB() {
        if (this.db) {
            await this.db.close();
            this.db = undefined;
        }
    }

    async save({ id, title, author, artist, lyrics, path }:
        { id: string; title: string; author: string; artist: string; lyrics: string; path: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return false;
        }
        try {
            await this.db.run('INSERT INTO songs (id, title, author, artist, lyrics, path) VALUES (?, ?, ?, ?, ?, ?)',
                [id, title, author, artist, lyrics, path]);
            logger.info(`Música "${title}" salva com ID ${id}.`);
            return true;
        } catch (error: any) {
            if (error.code === 'SQLITE_CONSTRAINT') {
                logger.error('A música que você está tentando inserir no banco de dados SQLite já existe.');
            } else if (error.code === 'SQLITE_MISMATCH') {
                logger.error('Um ou mais valores que você está tentando inserir na tabela songs não correspondem aos tipos de dados esperados pela coluna no banco de dados SQLite.');
            } else {
                logger.error('Erro ao salvar música:', error.message);
            }
            return false;
        }
    }

    async playSound({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        return; // Implementar a lógica de tocar o som aqui
        /*
        const song = await this.db.get('SELECT * FROM songs WHERE id = ?', [id]);
        if (!song) {
            logger.info(`Música com ID ${id} não encontrada.`);
            return;
        }
        logger.info(`Tocando: ${song.title}`);
        */
    }

    async getTitle({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        const song = await this.db.get('SELECT title FROM songs WHERE id = ?', [id]);
        if (!song || !song.title) {
            logger.info(`Título da música com ID ${id} não encontrado.`);
            return;
        }
        logger.info(`Título da música com ID ${id}: ${song.title}`);
        return song.title;
    }

    async getAuthor({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        const song = await this.db.get('SELECT author FROM songs WHERE id = ?', [id]);
        if (!song || !song.author) {
            logger.info(`Autor da música com ID ${id} não encontrado.`);
            return;
        }
        logger.info(`Autor da música com ID ${id}: ${song.author}`);
        return song.author;
    }

    async getArtist({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        const song = await this.db.get('SELECT artist FROM songs WHERE id = ?', [id]);
        if (!song || !song.artist) {
            logger.info(`Artista da música com ID ${id} não encontrado.`);
            return;
        }
        logger.info(`Artista da música com ID ${id}: ${song.artist}`);
        return song.artist;
    }

    async getPath({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        const song = await this.db.get('SELECT path FROM songs WHERE id = ?', [id]);
        if (!song || !song.path) {
            logger.info(`Caminho da música com ID ${id} não encontrado.`);
            return;
        }
        logger.info(`Caminho da música com ID ${id}: ${song.path}`);
        return song.path;
    }

    async getLyric({ id }: { id: string }) {
        if (!this.db) {
            logger.warn('Database not initialized.');
            return;
        }
        const song = await this.db.get('SELECT lyrics FROM songs WHERE id = ?', [id]);
        if (!song || !song.lyrics) {
            logger.info(`Letra da música com ID ${id} não encontrada.`);
            return;
        }
        logger.info(`Letra da música ${id}:\n${song.lyrics}`);
        return song.lyrics;
    }
}

// Exemplo de uso
(async () => {
    const newMusic = new Music();
    await newMusic.initDB();
    await newMusic.save({ id: "1", title: "Minha Canção", artist: "Artista", author: "Autor", lyrics: "Letra da música", path: "caminho/do/arquivo.mp3" });
    await newMusic.playSound({ id: "1" });
    await newMusic.getLyric({ id: "1" });
})();

