// Common
const images = require('./src/routes/controller_image');
const utility = require("./src/routes/controller_utility");
// Saída
const historico = require('./src/routes/controller_historico_pedido');
const user = require('./src/routes/controller_user');
const views = require('./src/routes/controller_views');
// Entrada
const cliente = require('./src/routes/controller_cliente');
const venda = require('./src/routes/controller_venda');
const visita = require('./src/routes/controller_visita')
// Painel
const dash = require('./src/routes/controller_dashboard')
const config = require('./src/routes/controller_config_ambiente');

// const webMeta = require('./src/routes/web/controller_web_meta')
// const webMetaGenrenciar = require('./src/routes/web/controller_web_meta_gerenciar')
// const webUtil = require('./src/routes/web/controller_web_util')

// SERVER

const serverEngine = require('./src/managers/server_engine')
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const {debugMode} = require("./src/managers/server_controller");

const flutter = path.join(__dirname, 'public-flutter');

/**
 * @param req {Request}
 */
function debug(req, res, n) {
    console.log('request', req.path)
    n();
}

serverEngine.singleThread(true, 'porta', (app) => {

    if(debugMode()){
        app.use(debug)
    }

    app.use(express.static(flutter));

    images.register(app);
    utility.register(app);
    historico.register(app);
    user.register(app);

    app.use('/view', views);

    cliente.register(app)
    venda.register(app);
    visita.register(app);
    config.register(app);
    dash.register(app);

}, () => {
    console.log('--------------------------------------------------------')
    console.log('\n' + '    ______      ____   _____                          \n' + '   / ____/_  __/ / /  / ___/___  ______   _____  _____\n' + '  / /_  / / / / / /   \\__ \\/ _ \\/ ___/ | / / _ \\/ ___/\n' + ' / __/ / /_/ / / /   ___/ /  __/ /   | |/ /  __/ /    \n' + '/_/    \\__,_/_/_/   /____/\\___/_/    |___/\\___/_/     \n' + '                                                      \n')
    console.log('--------------------------------------------------------')
    console.log('Versão 1.4.38b')
});







