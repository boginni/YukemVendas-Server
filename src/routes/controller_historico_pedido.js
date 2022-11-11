const daoHistorico = require('../dao/output/dao_historico_pedido');
const {checkDevice} = require("../middleware/seguranca");

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/historico/', checkDevice, daoHistorico.historicoCompleto);
    },
}
