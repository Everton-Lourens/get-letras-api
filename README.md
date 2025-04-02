# Get Letras

Download: https://drive.google.com/drive/folders/1FIqnJ9wpoHELOp9llJOW9wfgoXIj1po0?usp=sharing

Este aplicativo foi desenvolvido para solucionar um problema da igreja.
Vi que tínhamos um problema na mídia da igreja que faço parte e criei a solução.
Sempre que alguém cantava uma música que não tinha cadastrado no programa do projetor do telão, tínhamos que fazer tudo isso de forma manual.
O programa busca letras de músicas gospel diretamente do site [letras.mus.br](https://www.letras.mus.br/) utilizando uma pesquisa automatizada nos motores de busca.

Imagem exemplo 1:
  ```bash
  https://ibb.co/DMVvNSr
  ```

Imagem exemplo 2:
  ```bash
  https://ibb.co/W5R7q3H
  ```

Imagem exemplo 3:
  ```bash
  https://ibb.co/0mBjkjw
  ```

## Funcionalidades

- Realiza uma busca automatizada através de múltiplos motores de busca até localizar o site "`letras.mus.br`" com a letra da música pesquisada (Obs: inclui em todas as pesquisas a palavra-chave "`gospel`". Isso garante resultados relevantes para o contexto de igrejas, filtrando letras de músicas não gospel.).
- Retorna o primeiro resultado da pesquisa do buscador que encontrou o link do site "`letras.mus.br`", redirecionando para o site e realizando a extração do conteúdo da pagina (com a letra da música), removendo os elementos HTML indesejados.
- Retorna a letra da música, artista e título.
  
## Tecnologias Utilizadas

- **Linguagem de programação:** `Node.js`
- **Requisições HTTP:** Utilização de requisições HTTP para interagir com motores de busca e o site `letras.mus.br`.
- **Manipulação de HTML:** Extração de conteúdo através da manipulação de HTML utilizando a biblioteca `Cheerio`.

## Como Funciona

1. O usuário fornece o nome da música gospel que deseja buscar.
2. O aplicativo utiliza os motores de busca para realizar uma pesquisa com o seguinte formato:

    ```bash
    query + ' gospel site:letras.mus.br'
    ```

3. O primeiro link retornado pela pesquisa dos motores de busca, que aponta para o site [letras.mus.br](https://www.letras.mus.br/), é acessado.
4. O conteúdo da página é analisado e a letra da música é extraída, removendo os elementos HTML indesejados.

## Exemplo de Uso

Suponha que você queira buscar a letra da música "Fernandinho, uma coisa peço ao Senhor":

```bash
searchOnMultipleEngines('Fernandinho, uma coisa peço ao Senhor gospel site:letras.mus.br');
# Get-Letras-exe
