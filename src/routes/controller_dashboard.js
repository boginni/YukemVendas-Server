const seguranca = require("../middleware/seguranca");
const {header, body} = require("express-validator");
const {validation_form} = require("../middleware/validator");


const critica = require('../dao/dashboard/dao_critica_vendedor')
const statusPedido = require('../dao/dashboard/dao_status_pedidos')
const metaVendedor = require('../dao/dashboard/dao_meta_vendedor')

let bodyCheck = [
    body('id_vendedor')
        .exists()
        .isNumeric(),
    body('data_inicio')
        .exists()
        .isDate(),
    body('data_fim')
        .exists()
        .isDate(),
];


module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {


        app.post('/dash/critica/', seguranca.checkDevice, bodyCheck, validation_form, critica.selectData);

        app.post('/dash/status/pedido/', seguranca.checkDevice, bodyCheck, validation_form, statusPedido.selectData);

        app.post('/dash/meta/vendedor/', validation_form, metaVendedor.selectData);

    }

}


