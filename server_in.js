const express = require('express');
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();
// app.use(cors());
// app.use(cookieParser());



/*
 *  REGISTRA AS ROTAS
 */
const cliente = require('./src/routes/controller_cliente');
const venda = require('./src/routes/controller_venda');
const utility = require("./src/routes/controller_utility");
const images = require('./src/routes/controller_image');
const daoConfig = require('./src/routes/controller_config_ambiente');
const visita = require('./src/routes/controller_visita')


cliente.register(app)
venda.register(app);
utility.register(app);
images.register(app);
daoConfig.register(app);
visita.register(app);


/**
 *  Inicializa o servidor
 */

const serverEngine = require('./src/managers/server_engine')
serverEngine.start(app, false, () => {
    console.log('Input Server')
});