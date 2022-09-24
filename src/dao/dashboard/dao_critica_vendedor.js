const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const {getOptions} = require("../../managers/server_controller");
const {fast} = require("../../common/query_buffer");

module.exports = {

    /**
     *
     * @param req {Request}
     * @param res {Response}
     */
    selectData: (req, res) => {
        let options = getOptions(req.headers.ambiente)
        let param = [req.body['id_vendedor'], req.body['data_inicio'], req.body['data_fim']];
        fast(res, options, tbName, sql, param)
    }

}


const tbName = 'DASH_VW_CRITICA_VENDEDOR';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName} where ID_VENDEDOR = ? and DATA_EMISSAO BETWEEN ? AND ? ;`;

