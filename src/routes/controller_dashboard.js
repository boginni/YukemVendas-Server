
const dash = require('../dao/dashboard/dao_dash')

module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {
        app.post('/dash/vendas/', async (req, res) => {
            dash.getVendedorVendas(req, res);
        });

        app.post('/dash/vendedor/', async (req, res) => {
            dash.getVendedores(req, res);
        });

        app.post('/dash/periodo/vendas/', async (req, res) => {
            dash.getPeriodoVendas(req, res);
        });

    }

}
