/*
import { Database, OPEN_READWRITE, OPEN_CREATE } from 'sqlite3';

// Cria ou abre o banco de dados SQLite
const db = new Database('./lyrics.db', OPEN_READWRITE | OPEN_CREATE, (err) => {
  if (err) {
    console.error('Erro ao abrir o banco de dados:', err.message);
  } else {
    console.log('Banco de dados aberto com sucesso');
  }
});

// Cria a tabela caso ela não exista
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS lyrics (
      id TEXT PRIMARY KEY,
      title TEXT,
      artist TEXT,
      author TEXT,
      lyrics TEXT
    )
  `);
});

export default db;

*/