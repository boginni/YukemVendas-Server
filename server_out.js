const express = require('express');
const cookieParser = require("cookie-parser");
const http = require('http');
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());

// app.use(cookieParser());
// app.use(cors());

app.use('/image', express.static('image'));

app.use(function errorHandler(err, req, res, next) {
    res.status(400)
    res.send('error ' + err.message);
});

const historico = require('./src/routes/controller_historico_pedido');
const user = require('./src/routes/controller_user');
const views = require('./src/routes/controller_views');
const utility = require("./src/routes/controller_utility");

historico.register(app);
user.register(app);
views.register(app);
utility.register(app);

const serverEngine = require('./src/managers/server_engine')
serverEngine.start(app, true, () => {
    console.log('Output Server')
});