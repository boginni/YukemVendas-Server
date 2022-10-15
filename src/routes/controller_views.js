const daoView = require('../dao/output/dao_view');
const errors = require('../common/error');
const fs = require('fs')

const seguranca = require("../middleware/seguranca");


module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {

        app.post('/view/ping', async (req, res) => {
            res.send(1).end();
        });

        app.post('/view/buffed', seguranca.checkDevice, daoView.getViewContent);
    }

}








