/*
import db from './db'; // Importe o banco de dados

// Crie uma função que recebe os parâmetros para salvar
const saveLyric = async (fullLyric: object | any) => {
  const { title, artist, lyrics } = fullLyric;
  if (!title || !artist || !lyrics) {
    console.error('Dados incompletos:', fullLyric);
    return;
  }
  // Insira os dados no banco de dados
  const insertQuery = `
    INSERT INTO lyrics (id, title, artist, author, lyrics)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.run(insertQuery, ['11', title, artist, artist, lyrics], (err) => {
    if (err) {
      console.error('Erro ao inserir dados:', err.message);
    } else {
      console.log('Dados inseridos com sucesso');
    }
  });
};

// Chame a função com o parâmetro html
saveLyric(fullLyric);

*/