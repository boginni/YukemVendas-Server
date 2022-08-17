const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const {getOptions} = require("../../managers/server_controller");
const {timeUtility} = require("../../common/utility");

module.exports = {

    /**
     *
     * @param req {Request}
     * @param res {Response}
     */
    selectData: (req, res) => {
        res.status(200);


        let options = getOptions(req.headers.ambiente)


        query.simple(options, tbNameA, sqlA,
            err => {
                errors.erro_interno_fb(res);
                return;
            },
            (err, resultSetA) => {
                if (err) {
                    console.log(err);
                    errors.erro_interno_fb(res);
                    return;
                }
                //

                query.simple(options, tbNameB, sqlB,
                    err => {
                        errors.erro_interno_fb(res);
                        return;
                    },
                    (err, resultSetB) => {
                        if (err) {
                            console.log(err);
                            errors.erro_interno_fb(res);
                            return;
                        }


                        treatData(req, res, resultSetA, resultSetB)


                    },
                    req.body['id_vendedor'], req.body['data_inicio'], req.body['data_fim']
                )

                //


            },
            req.body['id_vendedor'], req.body['data_inicio'], req.body['data_fim']
        )

    }

}


/**
 *
 * @param req {Request}
 * @param res {Response}
 * @param resA
 * @param resB
 */
function treatData(req, res, resA, resB) {

    let resultSet = {
        totais: {
            total: 0,
            peso: 0,
            pedidos: 0,
            date: timeUtility.getDateTime()
        },
        columns: {
            cab: resA.columns,
            det: resB.columns
        },
        rows: []

    }


    let rows = {};

    for (const pedido of resA.rows) {

        let uuid = pedido[2];
        let x = {
            cab: pedido,
            det: []
        }

        if (pedido[4] !== 'SALVO') {
            resultSet.totais.total += pedido[5];
            resultSet.totais.peso += pedido[7];
            resultSet.totais.pedidos++;
        }


        rows[uuid] = x;
    }

    for (const item of resB.rows) {
        let uuid = item[2];
        rows[uuid].det.push(item);


    }


    for (const rowKey in rows) {
        let row = rows[rowKey];
        resultSet.rows.push(row)
    }


    // for (const row of rows) {
    // }

    resultSet.totais.peso = (resultSet.totais.peso / 1000).toString().replace('.', ',') + ' Kg';

    res.send(resultSet)
}


const tbNameA = 'DASH_VW_STATUS_PEDIDO';
// language=SQL format=false
const sqlA = `SELECT * FROM ${tbNameA} where ID_USER = ? and cast(DATA_INSERCAO as date) BETWEEN ? AND ? ;`;

const tbNameB = 'DASH_VW_STATUS_PEDIDO_ITEM';
// language=SQL format=false
const sqlB = `SELECT * FROM ${tbNameB} where ID_USER = ? and cast(DATA_INSERCAO as date) BETWEEN ? AND ? ;`;

