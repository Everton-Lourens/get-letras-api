const axios = require('axios');
const cheerio = require('cheerio');
const { app, BrowserWindow } = require('electron');
const express = require('express');
const path = require('path');
const __dirname = path.dirname(__filename);
const PORT = 3009;

let mainWindow;
let expressApp;
var isReady = false;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true
        }
    });

    mainWindow.loadFile(`${__dirname}/html/index.html`);

    mainWindow.on('closed', function () {
        mainWindow = null;
    });
}

app.whenReady().then(() => {
    isReady = true;
});


app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit();
});

app.on('activate', function () {
    if (mainWindow === null) createWindow();
});