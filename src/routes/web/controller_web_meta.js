// const seguranca = require("../middleware/seguranca");
const {header, body} = require("express-validator");
const {validation_form} = require("../../middleware/validator");


const meta = require('../../dao/dashboard/web/dao_web_meta_gerenciar')


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


function finish(req, res) {
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



    }

}


