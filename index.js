const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');

let query = 'PRECISO DE TI';

init(query);

async function init(query) {
   try {
      searchOnGoogle(query + ' gospel site:letras.mus.br');
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

         if (firstLink) {
            try {
               const response = await axios.get(firstLink);

               parseSearchResponseToList(response.data);

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

      console.log(title);
      console.log(artist);
      console.log(letraBruta.trim()); // IMPORTANTE DEIXAR

   } catch (error) {
      console.error('Ocorreu um erro:', error);
   }
}
