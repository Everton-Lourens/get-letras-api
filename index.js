
function search() {
   const searchInput = document.getElementById('searchInput').value;
   changeColor('btn-search', false)
   fetch(`http://localhost:3000/search?q=${searchInput}`)
      .then(response => response.json())
      .then(data => {
         if (data) {
            const { title, artist, letraBruta } = data;
            document.getElementById('title').textContent = title;
            document.getElementById('artist').textContent = artist;
            document.getElementById('lyrics').textContent = letraBruta;
            document.getElementById('searchInput').value = '';
            toggleDiv(false);
         } else {
            changeColor('btn-search', true)
            document.getElementById('title').textContent = '';
            document.getElementById('artist').textContent = '';
            document.getElementById('lyrics').textContent = '';
            toggleDiv(true);
            // Exibe uma mensagem caso não haja resultados.
            setTimeout(() => {
               alert('Nenhuma letra encontrada.');
            }, 100);
         }

      })
      .catch(error => console.log('Erro na busca de letras.' + error));
}


document.addEventListener('keydown', function (event) {
   // Verifica se a tecla pressionada é Enter (código 13)
   if (event.key === 'Enter') {
      // Aciona o clique no botão com base no seu ID
      document.getElementById('btn-search').click();
   }
});


function changeColor(idElement, error) {
   var spanContent = document.getElementById(idElement);

   if (!error) {
      // Altera temporariamente a cor para verde
      spanContent.classList.add('copied');
      // Define um timeout para voltar à cor normal após 1 segundo
      setTimeout(function () {
         spanContent.classList.remove('copied');
      }, 1500);
   } else {
      // Altera temporariamente a cor para verde
      spanContent.classList.add('error');
      // Define um timeout para voltar à cor normal após 1 segundo
      setTimeout(function () {
         spanContent.classList.remove('error');
      }, 1500);
   }
}


function toggleDiv(status) {
   var divResultados = document.getElementById('div-resultados');
   // Alterna a visibilidade com base no estado atual
   divResultados.style.display = status ? 'none' : 'block';
}





function copy(idElement) {
   // Seleciona o conteúdo do span
   var spanContent = document.getElementById(idElement);
   var range = document.createRange();
   range.selectNode(spanContent);
   window.getSelection().removeAllRanges();
   window.getSelection().addRange(range);

   // Copia o conteúdo selecionado
   document.execCommand('copy');

   // Limpa a seleção
   window.getSelection().removeAllRanges();
}


function limitCharacters(inputField, maxLength) {
   // Verifica se o comprimento do valor é maior que o limite
   if (inputField.value.length > maxLength) {
      // Se for, corta o valor para o limite máximo
      inputField.value = inputField.value.slice(0, maxLength);
   }
}