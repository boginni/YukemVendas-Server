const errors = require('../common/error');
const dao_visita = require('../dao/input/dao_visita')
const queue = require("express-queue");

module.exports = {
    // @app Express
    register: (app) => {
        app.post('/visita/', queue({activeLimit: 1, queuedLimit: -1}), dao_visita.insertVisita)
    }
}