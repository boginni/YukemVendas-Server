const errors = require('../common/error');
const dao = require('../dao/input/dao_venda');
const daoSync = require('../dao/input/dao_venda_sync');
const queue = require("express-queue");
const seguranca = require("../middleware/seguranca");
const {header, body} = require("express-validator");

module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {
        app.post('/venda/add/', seguranca.checkDevice, checkBody, daoSync.adicionar);

        app.post('/venda/ping/', seguranca.checkDevice, dao.pingar);
    }

}


function checkBody(req, res, next) {
    /**
     * @type {Venda[]}
     */
    let list = req.body;

    try {
        if (list.length > 0) {
            return next();
        } else {
            return errors.invalido_body(res)
        }
    } catch (e) {
        return errors.invalido_body(res);
    }
}


