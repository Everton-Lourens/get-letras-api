# Get Letras

Download .exe: https://drive.google.com/drive/folders/1FIqnJ9wpoHELOp9llJOW9wfgoXIj1po0?usp=sharing

# Tópicos do README
- *Tecnologias Utilizadas*
- *Visão Geral*
- *Como utilizar Localmente*
- *Passo a Passo*
- *Exemplo de Uso*

## Tecnologias Utilizadas
- **Node.js**
- **TypeScript**
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

## Como Utilizar Localmente
- **Descrição**: Instale as dependências "`npm run setup`" e utilize "`npm run start`" para iniciar o Front-End e o Back-End *(localhost:9999)* ao mesmo tempo com a lib de desenvolvimento "`concurrently`".

```bash
git clone https://github.com/Everton-Lourens/Get-Letras.git
cd Get-Letras
npm run setup
npm run start
```

## Passo a Passo

**1.** O usuário fornece o nome da música gospel que deseja buscar através da rota `/search`, utilizando parâmetros de consulta (query params), como:

   - `text` (obrigatório): nome da música ou trecho.
   - `title`, `artist`, `author`, `lyrics` (opcionais): filtros booleanos para refinar a busca.

   **Exemplo de requisição:**

```bash
/search?text=uma+coisa+peço+ao+Senhor&title=true&artist=true&lyrics=true
```

**2.** A API verifica se a letra já está salva no banco de dados local (SQLite):

```ts
const searchMusicDatabase = await findMusic(query);
```

**3.** Se a música for encontrada no banco, a API responde com status 200 e retorna os dados.

**4.** Caso a letra não esteja no banco, a API executa uma busca automática em múltiplos motores de busca com a seguinte query:

```bash
nome-da-musica + " gospel site:letras.mus.br"
```

**5.** O primeiro link do domínio letras.mus.br encontrado nos buscadores é acessado.

**6.** A página da música é processada via HTML parsing (utilizando a biblioteca Cheerio), e a letra é extraída com a remoção de elementos HTML desnecessários.

**7.** A letra extraída é:
  - Retornada ao usuário com status 201
  - Salva no banco de dados para consultas futuras:

```ts
const newMusic = new mySqliteMusic();
newMusic.save(response);
res.status(201).json(
    [response]
).end();
```

**8.** Se nenhum resultado válido for encontrado, a API responde com status 422.

## Exemplo de Uso

Suponha que você queira buscar a letra da música "Fernandinho, uma coisa peço ao Senhor":

```bash
searchOnMultipleEngines('Fernandinho, uma coisa peço ao Senhor gospel site:letras.mus.br');
```