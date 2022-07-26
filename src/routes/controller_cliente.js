const daoCliente = require('../dao/input/dao_cliente');
const queue = require("express-queue");

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {

        app.post('/cliente/', queue({activeLimit: 1, queuedLimit: -1}), async (req, res) => {
            daoCliente.insert(req, res);
        });

    }

}

