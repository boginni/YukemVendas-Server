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

        app.post('/historico/', async (req, res) => {

            /**
             * VARIÁVEIS PARA RECEBIMENTO DO HEADER
             */
            var ambiente = req.headers.ambiente;

            daoHistorico.historicoCompleto(req, res);
        });


        // app.post('/historico/parcial', async (req, res) => {
        //
        //     /**
        //      * VARIÁVEIS PARA RECEBIMENTO DO HEADER
        //      */
        //     var ambiente = req.headers.ambiente;
        //
        //     daoHistorico.det(ambiente, req.body, res);
        // });

    },
}
