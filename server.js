const express = require('express');
const app = express();

// Common

const images = require('./src/routes/controller_image');
const utility = require("./src/routes/controller_utility");

images.register(app);
utility.register(app);

// Saída

const historico = require('./src/routes/controller_historico_pedido');
const user = require('./src/routes/controller_user');
const views = require('./src/routes/controller_views');

historico.register(app);
user.register(app);
views.register(app);

// Entrada

const cliente = require('./src/routes/controller_cliente');
const venda = require('./src/routes/controller_venda');
const visita = require('./src/routes/controller_visita')

cliente.register(app)
venda.register(app);
visita.register(app);

// Painel

const dash = require('./src/routes/controller_dashboard')
const config = require('./src/routes/controller_config_ambiente');

config.register(app);
dash.register(app);

const serverEngine = require('./src/managers/server_engine')

serverEngine.start(app, true, () => {
    console.log('--------------------------------------------------------')
    console.log('\n' +
        '    ______      ____   _____                          \n' +
        '   / ____/_  __/ / /  / ___/___  ______   _____  _____\n' +
        '  / /_  / / / / / /   \\__ \\/ _ \\/ ___/ | / / _ \\/ ___/\n' +
        ' / __/ / /_/ / / /   ___/ /  __/ /   | |/ /  __/ /    \n' +
        '/_/    \\__,_/_/_/   /____/\\___/_/    |___/\\___/_/     \n' +
        '                                                      \n')
    console.log('--------------------------------------------------------')
});