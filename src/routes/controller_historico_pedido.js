const daoHistorico = require('../dao/output/dao_historico_pedido');

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/historico/', daoHistorico.historicoCompleto);
    },
}
