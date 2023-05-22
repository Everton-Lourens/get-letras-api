const axios = require('axios');
const cheerio = require('cheerio');

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

         console.log(firstLink);

         if (firstLink) {
            try {
               const response = await axios.get(firstLink);
               console.log('1111111111111');
               const searchResults = parseSearchResponseToList(response.data);
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
 
     //console.log(title);
     //console.log(artist);
 
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
 
   } catch (error) {
     console.error('Ocorreu um erro:', error);
   }
 }

const query = 'seu sangue' + ' site:letras.mus.br';
searchOnGoogle(query);


 //parseSearchResponseToList(html);

/*
   //const $ = cheerio.load(html);
   const searchResults = [];

   $('.search-results .cnt-list .cnt-list-row').each((index, element) => {
      const $element = $(element);
      const id = $element.find('.cnt-list-row .cnt-list-row a').attr('href');
      const title = $element.find('.cnt-list-row .cnt-list-name').text().trim();
      const artist = $element.find('.cnt-list-row .cnt-list-artist').text().trim();

      searchResults.push({ id, title, artist });
   });

   return searchResults;
}
*/

// Exemplo de uso:
//const input = {
   //text: 'Em Fervente Oração'
//};

//searchLyrics()
   //.then(results => {
     // console.log(results);
   //})
   //.catch(error => {
     // console.error('Error occurred:', error);
  // });