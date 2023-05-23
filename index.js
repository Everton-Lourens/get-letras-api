const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

query();

async function query() {
   try {
      const filePath = './letra.txt'; // Caminho do arquivo de texto
      const pesquisarLetra = fs.readFileSync(filePath, 'utf8');

      //console.log(pesquisarLetra + ' site:letras.mus.br');
      searchOnGoogle(pesquisarLetra + ' site:letras.mus.br');

   } catch (error) {
      console.error('Erro ao ler o arquivo:', error);
   }
}

async function searchOnGoogle(query) {
   const baseUrl = 'https://www.google.com/search';
   const encodedQuery = encodeURIComponent(query);
   const url = `${baseUrl}?q=${encodedQuery}`;

   try {
      const response = await axios.get(url);
      const html = response.data;
      const match = html.match(/\/url\?q=([^&]+)/);
      if (match && match[1]) {
         const firstLink = decodeURIComponent(match[1]);

         //console.log(firstLink);

         if (firstLink) {
            try {
               const response = await axios.get(firstLink);
               console.log('1111111111111');
               parseSearchResponseToList(response.data);
               console.log('2222222222222');
            } catch (error) {
               console.error('Erro ao pesquisar letra:', error);
            }
         }
      } else {
         console.log('Nenhum link encontrado.');
      }
   } catch (error) {
      console.error('Ocorreu um erro durante a solicitação:', error);
   }
}

function parseSearchResponseToList(html) {
   try {
      let $ = cheerio.load(html);
      const titleElement = $('title');
      const titleName = titleElement.text();
      const titleAndArtist = titleName.replace(' - LETRAS.MUS.BR', '');

      const splitTitleAndArtist = titleAndArtist.split(' - ');

      const title = splitTitleAndArtist[0];
      const artist = splitTitleAndArtist[1];

      console.log(title);
      console.log(artist);

      // Selecionar o elemento que contém a letra da música
      const letraContainer = $('.cnt-letra');

      // Extrair o texto bruto da letra
      let letraBruta = letraContainer.html();

      // Substituir <br> por \n
      letraBruta = letraBruta.replace(/<br\s*\/?>/gi, '\n');

      // Substituir <p> por \n\n
      letraBruta = letraBruta.replace(/<\/?p[^>]*>/gi, '\n');

      // Remover tags restantes
      letraBruta = letraBruta.replace(/<\/?[^>]+(>|$)/g, '');

      console.log(letraBruta.trim());

      try {
         const filePath = './letra.txt'; // Caminho do arquivo de texto
         const conteudoParaEscrever = letraBruta.trim();
   
         // Opção 1: Escrever de forma síncrona
         fs.writeFileSync(filePath, conteudoParaEscrever, 'utf8');
         console.log('Conteúdo escrito no arquivo com sucesso.');
   
         // Opção 2: Escrever de forma assíncrona
         fs.writeFile(filePath, conteudoParaEscrever, 'utf8', (error) => {
            if (error) {
               console.error('Erro ao escrever no arquivo:', error);
            } else {
               console.log('Conteúdo escrito no arquivo com sucesso.');
            }
         });
      } catch (error) {
         console.error('Erro ao escrever no arquivo:', error);
      }

   } catch (error) {
      console.error('Ocorreu um erro:', error);
   }
}