# Get Letras

Download .exe: https://drive.google.com/drive/folders/1FIqnJ9wpoHELOp9llJOW9wfgoXIj1po0?usp=sharing

# Tópicos do README
- *Tecnologias Utilizadas*
- *Visão Geral*
- *Como utilizar Localmente*
- *Como Funciona*
- *Exemplo de Uso*

## Tecnologias Utilizadas
- **Node.js**
- **JavaScript**
- **Express.js**
- **Docker**
- **Express.js**
- **Concurrently (para executar Front-End e Back-End juntos)**
- **HTML Parsing**
- **HTTP Requests**

## Visão Geral
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

## Como utilizar Localmente
- **Descrição**: Instale as dependências "`npm run setup`" e utilize "`npm run start`" para iniciar o Front-End e o Back-End *(localhost:9999)* ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/Get-Letras.git
cd Get-Letras
npm run setup
npm run start
```

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
