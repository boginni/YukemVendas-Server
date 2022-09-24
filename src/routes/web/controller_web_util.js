// const seguranca = require("../middleware/seguranca");
const {header, body} = require("express-validator");
const {validation_form} = require("../../middleware/validator");


const util = require('../../dao/dashboard/web/dao_web_util')


function f(req, res) {
    res.status(200).end()

}

function d(req, res, next) {
    req.headers.ambiente = 'altogiro';
    req.headers.user_id = '1';
    req.headers.user_uuid = '';

    next();
}

module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {
        app.post('/dash/web/util/produto/list', d, util.produto.list)
    }

}


