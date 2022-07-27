const express = require('express');

const app = express();


// app.use(cookieParser());
// app.use(cors());

/**
 *  Inicializa o servidor
 */

const serverEngine = require('./src/managers/server_engine')
serverEngine.start(
    false,
    'portaDash',
    (app) => {
        console.log('teste')
    },
    () => {
        console.log('Painel Server')
    });
