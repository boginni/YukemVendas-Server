const historico = require('./src/routes/controller_historico_pedido');
const user = require('./src/routes/controller_user');
const views = require('./src/routes/controller_views');
const utility = require("./src/routes/controller_utility");

const serverEngine = require('./src/managers/server_engine');

serverEngine.start(true, 'portaOut',(app) => {
    historico.register(app);
    user.register(app);
    views.register(app);
    utility.register(app);
}, () => {
    console.log('Output Server')
});