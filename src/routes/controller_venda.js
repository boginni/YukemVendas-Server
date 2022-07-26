const errors = require('../common/error');
const dao = require('../dao/input/dao_venda');

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/venda/add/', async (req, res) => {

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






