const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const {getOptions} = require("../../managers/server_controller");

module.exports = {

    /**
     *
     * @param req {Request}
     * @param res {Response}
     */
    selectData: (req, res) => {
        res.status(200);

        let options = getOptions(req.headers.ambiente)

        // console.log(sql)
        // console.log(req.body['id_vendedor'], req.body['data_inicio'], req.body['data_fim'])

        query.simple(options, tbName, sql,
            err => {
                errors.erro_interno_fb(res);
                return;
            },
            (err, resultSet) => {
                if (err) {
                    console.log(err);
                    errors.erro_interno_fb(res);
                    return;
                }
                res.send(resultSet);
            },
            req.body['id_vendedor'], req.body['data_inicio']
        )
    }

}


const tbName = 'DASH_VW_META_VENDA_VENDEDOR';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName} where ID_USER = ? and ? BETWEEN DATA_INICIO AND DATA_FIM ;`;

