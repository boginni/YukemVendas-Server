const daoUser = require('../dao/output/dao_login');

const {body, header} = require("express-validator");

const validator = require('../middleware/validator')


module.exports = {
    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {
        app.post('/login/', checkLogin, validator.form_validation, daoUser.login)
    }
}


let checkLogin = [
    body('usuario')
        .exists()
        .isLength({min: 1, max: 100}),
    body('pass')
        .exists()
        .isLength({min: 1, max: 100}),
    header('ambiente')
        .exists()
        .isLength({min: 1, max: 100})
]