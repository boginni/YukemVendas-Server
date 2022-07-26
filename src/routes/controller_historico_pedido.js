const daoHistorico = require('../dao/output/dao_historico_pedido');


var headerErr = {'error': 'Erro no Header'};

/*
 *  ROTA UTILIZADA PARA PROCURAR O HISTORICO DE PEDIDOS
 */

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/historico/', daoHistorico.historicoCompleto);
    },
}
