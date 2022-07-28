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

// SERVER

const serverEngine = require('./src/managers/server_engine')

serverEngine.start(true,
    (app) => {
        images.register(app);
        utility.register(app);
        historico.register(app);
        user.register(app);
        views.register(app);
        cliente.register(app)
        venda.register(app);
        visita.register(app);
        config.register(app);
        dash.register(app);
    }, () => {
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