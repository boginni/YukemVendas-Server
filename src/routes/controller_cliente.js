const daoCliente = require('../dao/input/dao_cliente');

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {

        app.post('/cliente/', async (req, res) => {
            daoCliente.insert(req, res);
        });

    }

}

