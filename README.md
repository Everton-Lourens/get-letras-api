# Get Letras

![Exemplo 1 de Tela do Aplicativo](https://ibb.co/DMVvNSr)
![Exemplo 2 de Tela do Aplicativo](https://ibb.co/W5R7q3H)
![Exemplo 3 de Tela do Aplicativo](https://ibb.co/0mBjkjw)

Este aplicativo foi desenvolvido para solucionar um problema da igreja.
Vi que tínhamos um problema na mídia da igreja que faço parte e criei a solução.
Sempre que alguém cantava uma música que não tinha cadastrado no programa do projetor do telão, tínhamos que fazer tudo isso de forma manual.
O programa busca letras de músicas gospel diretamente do site [Letras.mus.br](https://www.letras.mus.br/) utilizando uma pesquisa automatizada no Google e simples.

## Funcionalidades

- Realiza uma requisição ao Google utilizando a pesquisa da música desejada com o termo `gospel`.
- Retorna o primeiro resultado da pesquisa Google, que direciona para o site Letras.mus.br.
- Acessa o site Letras.mus.br e faz a extração do conteúdo da letra da música removendo os elementos HTML indesejados.
  
## Tecnologias Utilizadas

- Linguagem de programação: **Node.js**
- Utilização de requisições HTTP para o Google e para o site Letras.mus.br.
- Manipulação de HTML para extração de conteúdo.

## Como Funciona

1. O usuário fornece o nome da música gospel que deseja buscar.
2. O aplicativo utiliza o Google para realizar uma pesquisa com o seguinte formato:

    ```bash
    query + ' gospel site:letras.mus.br'
    ```

3. O primeiro link retornado pela pesquisa do Google, que aponta para o site [Letras.mus.br](https://www.letras.mus.br/), é acessado.
4. O conteúdo da página é analisado e a letra da música é extraída, removendo os elementos HTML indesejados.

## Exemplo de Uso

Suponha que você queira buscar a letra da música "Fernandinho, uma coisa peço ao senhor":

```bash
searchOnGoogle('Fernandinho, uma coisa peço ao senhor gospel site:letras.mus.br');
