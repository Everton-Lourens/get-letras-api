const axios = require('axios');
const cheerio = require('cheerio');
const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');

let mainWindow;
let expressApp;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile('index.html');

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    createWindow();
    expressApp = express();

    expressApp.get('/search', async (req, res) => {
        // Implemente a lógica de busca de letras aqui.
        const searchTerm = req.query.q; // Parâmetro da consulta, correspondente ao termo de busca.
        const resonse = await init(searchTerm);
        return res.json(resonse);
    });

    expressApp.listen(3000, () => {
        console.log('Servidor Express rodando na porta 3000');
    });
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});


async function init(query) {
    try {
        return await searchOnMultipleEngines(query + ' gospel site:letras.mus.br');
    } catch (error) {
        console.error('Erro ao ler o arquivo:', error);
    }
}

async function searchOnMultipleEngines(query) {
    const searchEngines = [
        { name: "Bing", baseUrl: "https://www.bing.com/search", queryParam: "q" },
        { name: "Yahoo", baseUrl: "https://search.yahoo.com/search", queryParam: "p" },
        { name: "AOL", baseUrl: "https://search.aol.com/aol/search", queryParam: "q" },
        { name: "Brave", baseUrl: "https://search.brave.com/search", queryParam: "q" },
        { name: "Google", baseUrl: "https://www.google.com/search", queryParam: "q" },
        //{ name: "Yandex", baseUrl: "https://yandex.com/search/", queryParam: "text" },
        //{ name: "Ecosia", baseUrl: "https://www.ecosia.org/search", queryParam: "q" },
        //{ name: "StartPage", baseUrl: "https://www.startpage.com/sp/search", queryParam: "query" },
        //{ name: "MetaGer", baseUrl: "https://metager.org/meta/meta.ger3", queryParam: "eingabe" },
        //{ name: "DuckDuckGo", baseUrl: "https://duckduckgo.com/", queryParam: "q" },
    ];

    const encodedQuery = encodeURIComponent(query);

    for (const engine of searchEngines) {
        const url = `${engine.baseUrl}?${engine.queryParam}=${encodedQuery}`;
        console.log(`Tentando no ${engine.name}: ${url}`);

        try {
            const response = await axios.get(url);
            const html = response.data;
            const match = html.match(/https:\/\/www\.letras\.mus\.br\/[^'"\s&]+/);

            if (match && match[0]) {
                /*
                    const link = decodeURIComponent(match[0]);
                    return link;
                */
                const link = decodeURIComponent(match[0]);

                if (link) {
                    console.log(`Link encontrado no ${engine.name}: ${link}`);
                    try {
                        const response = await axios.get(link);

                        return await parseSearchResponseToList(response.data);

                    } catch (error) {
                        console.error('Erro ao pesquisar letra:', error);
                        return '';
                    }
                }
            }

        } catch (error) {
            if (error.response && error.response.status === 429) {
                console.warn(`Erro 429 no ${engine.name}. Pulando para o próximo...`);
            } else {
                console.error(`Erro ao tentar no ${engine.name}: ${error.message}`);
            }
        }

        await sleep(500);
    }

    console.log("Nenhum link encontrado em nenhum motor de busca.");
    return null;
}


// Função para adicionar atrasos entre requisições
function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}


async function parseSearchResponseToList(html) {

    try {
        let $ = cheerio.load(html);
        const titleElement = $('title');
        const titleName = titleElement.text();
        const titleAndArtist = titleName.replace(' - LETRAS.MUS.BR', '');

        const splitTitleAndArtist = titleAndArtist.split(' - ');

        const title = splitTitleAndArtist[0];
        const artist = splitTitleAndArtist[1];

        // Selecionar o elemento que contém a letra da música
        const letraContainer = $('.lyric-original');

        // Extrair o texto bruto da letra
        let letraBruta = letraContainer.html();

        // Substituir <br> por \n
        letraBruta = letraBruta.replace(/<br\s*\/?>/gi, '\n');

        // Substituir <p> por \n\n
        letraBruta = letraBruta.replace(/<\/?p[^>]*>/gi, '\n');

        // Remover tags restantes
        letraBruta = letraBruta.replace(/<\/?[^>]+(>|$)/g, '');

        letraBruta = letraBruta.trim();
        return { title, artist, letraBruta };

    } catch (error) {
        return '';
    }
}