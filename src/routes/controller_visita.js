const errors = require('../common/error');
const dao_visita = require('../dao/input/dao_visita')
const queue = require("express-queue");
const seguranca = require("../middleware/seguranca");

module.exports = {
    // @app Express
    register: (app) => {
        app.post('/visita/', seguranca.checkDevice, dao_visita.insertVisita)
    }
}