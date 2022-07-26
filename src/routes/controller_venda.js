const errors = require('../common/error');
const dao = require('../dao/input/dao_venda');
const queue = require("express-queue");

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/venda/add/', queue({activeLimit: 1, queuedLimit: -1}), async (req, res) => {

            /**
             * @type {Venda[]}
             */
            let list = req.body;

            if (list.length > 0) {
                dao.adicionar(req, res);
            } else {
                errors.invalido_body(res,)
            }


        });

        app.post('/venda/ping/', async (req, res) => {
            dao.pingar(req, res);
        });

        app.post('/venda/sync/', async (req, res) => {
            dao.pingar(req, res);
        });

    }

}






