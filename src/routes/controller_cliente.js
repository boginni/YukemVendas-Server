const daoCliente = require('../dao/input/dao_cliente');
const queue = require("express-queue");

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {

        app.post('/cliente/',  daoCliente.insert);

    }

}

