const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const {getOptions} = require("../../managers/server_controller");
const firebird = require("node-firebird");

module.exports = {

    /**
     *
     * @param req {Request}
     * @param res {Response}
     */
    selectData: async (req, res) => {
        res.status(200);

        let options = getOptions(req.headers.ambiente)

        // console.log(req.body['id_vendedor'], req.body['data_inicio'])
        // console.log(req.body['id_vendedor'], req.body['data_inicio'], req.body['data_fim'])

        let header = await new Promise((resolve, reject) => {

            firebird.attach(options, (err, db) => {
                db.query(sqlHeader, [req.body['id_vendedor'], req.body['data_inicio']], (err1, result) => {

                    db.detach();
                    resolve(result[0]);
                })

            })
        })

        if (header == undefined) {
            header = {'ID_META': 0};
        }


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
                resultSet['header'] = header;

                res.send(resultSet);
            },
            [req.body['id_vendedor'], header['ID_META']]
        )
    }

}


const tbName = 'DASH_VW_META_VENDA_VENDEDOR';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName} where ID_USER = ? and ID_META = ? ;`;


// language=SQL format=false
const sqlHeader = `SELECT * FROM dash_vw_meta_venda_header where ID_VENDEDOR = ? and ? BETWEEN DATA_INICIO AND DATA_FIM ;`;

