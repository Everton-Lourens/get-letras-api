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
        return await searchOnGoogle(query + ' gospel site:letras.mus.br');
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
        const match = html.match(/https:\/\/www\.letras\.mus\.br\/[^'"\s&]+/);

        if (match && match[0]) {
            const firstLink = decodeURIComponent(match[0]);

            if (firstLink) {
                try {
                    const response = await axios.get(firstLink);

                    return await parseSearchResponseToList(response.data);

                } catch (error) {
                    console.error('Erro ao pesquisar letra:', error);
                    return '';
                }
            }
        } else {
            console.log('Nenhum link encontrado.');
            return '';
        }
    } catch (error) {
        console.error('Ocorreu um erro durante a solicitação:', error);
        return '';
    }
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