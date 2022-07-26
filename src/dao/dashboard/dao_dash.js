const server = require("../../managers/server_controller");
const errors = require("../../common/error");

const vendedorVendas = require("./dao_dash_vendas")
const vendedores = require("./dao_dash_vendedores")
const periodoVendas = require("./dao_dash_periodo_vendas")

module.exports = {
    getVendedorVendas: (req, res) => {
        protectedCall(req, res, vendedorVendas.selectData)
    },

    getVendedores: (req, res) => {
        protectedCall(req, res, vendedores.selectData)
    },

    getPeriodoVendas: (req, res) => {
        protectedCall(req, res, periodoVendas.selectData)
    },
}

/**
 *
 * @param req {Request}
 * @param res {Response}
 * @param f {function(req, res, options)}
 */
function protectedCall(req, res, f) {

    let options = server.getOptions(req.headers.ambiente);

    if (options === null || options === undefined) {
        errors.invalido_ambiente(res);
        return;
    }

    f(req, res, options);
}