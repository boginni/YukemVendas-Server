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

        firebird.attach(options, async (err, db) => {


            let header = await new Promise((resolve, reject) => {

                db.query(sqlHeader, [req.body['id_vendedor'], req.body['data_inicio']], (err1, result) => {

                    try {
                        resolve(result[0]);
                    } catch (e) {
                        reject();
                    }


                })
            })




            if (header == undefined) {
                header = {'ID_META': 0};
                res.status(404).end();
                db.detach();
            } else {
                query.withConn(
                    db,
                    tbName,
                    sql,
                    (err, resultSet) => {
                        db.detach();

                        if (err) {
                            console.log(err);
                            errors.erro_interno_fb(res);
                            return;
                        }
                        resultSet['header'] = header;

                        console.log(resultSet)

                        res.send(resultSet);
                    },
                    [req.body['id_vendedor'], header['ID_META']]
                )
            }


        })


    }

}


const tbName = 'DASH_VW_META_ITEM_MOBILE';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName} where ID_USER = ? and ID_META = ? ;`;


// language=SQL format=false
const sqlHeader = `SELECT FIRST 1 * FROM DASH_VW_META_MOBILE where ID_VENDEDOR = ? AND ? BETWEEN DATA_INICIO AND DATA_FIM ;`;

