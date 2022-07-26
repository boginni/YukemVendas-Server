const errors = require('../common/error');
const dao_visita = require('../dao/input/dao_visita')

module.exports = {
    // @app Express
    register: (app) => {
        app.post('/visita/', dao_visita.insertVisita)
    }
}