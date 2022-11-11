const Firebird = require("node-firebird");
const controller = require("../../managers/server_controller");
const errors = require('../../common/error');

const seguranca = require('../../middleware/seguranca');


fs = require('fs')


let whereFiltro = "";

module.exports = {
    /**
     * @param req {Request}
     * @param res {Response}
     */
    historicoCompleto: async (req, res) => {

        let amb = req.headers.ambiente;
        let historicoPedido = req.body;

        if (historicoPedido.completo == null) {
            historicoPedido.completo = false;
        }

        // VALIDAÇÃO DE AMBIENTE
        var options = controller.getOptions(amb);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        let param = [];
        let historico = historicoPedido;
        param = [historico.pessoas];


        let sqlHistorico = '';

        let tipo = historico.completo ? selectHistoricoCompleto : selectHistoricoParcial;

        if (historico.filtrar_data === true) {
            whereFiltro = " AND a.DATA_EMISSAO BETWEEN ? AND CURRENT_TIMESTAMP";
            param.push(historico.data);

            sqlHistorico = tipo + whereFiltro + orderHistorico;
        } else {
            sqlHistorico = tipo + orderHistorico;
        }

        let resultSet = {
            "cab": [],
            'det': []
        }


        Firebird.attach(options, function (err, db) {

            new Promise((resolve, reject) => {
                db.query(sqlHistorico, param, function (err, result) {


                    if (err) {
                        errors.erro_interno_query(res);
                        return;
                    }


                    resultSet.cab = result;
                    resolve();

                    // res.status(200);
                    // res.send(result);

                });
            }).then(r => {

                let idList = [];
                for (const cab of resultSet.cab) {
                    idList.push(cab.ID);
                }

                if (idList.length === 0) {
                    res.send(resultSet);
                    return
                }


                db.query(historicoPedido.completo ? sqlHistoricoDet : sqlHistoricoDetLite, [idList], function (err, result) {

                    console.log('Query  2 finish');

                    db.detach();
                    if (err) {
                        errors.erro_interno_query(res);
                        console.log(err);
                        return;
                    }

                    resultSet.det = result;
                    res.send(resultSet);

                });


            })


        });


    },


    cab: (amb, historicoPedido, res) => {

        // VALIDAÇÃO DE AMBIENTE
        var options = controller.getOptions(amb);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        let param = [];
        let historico = historicoPedido;
        param = [historico.pessoas];

        let sqlHistorico = '';

        if (historico.filtrar_data === true) {
            whereFiltro = " AND a.DATA_EMISSAO BETWEEN ? AND CURRENT_TIMESTAMP";
            param.push(historico.data);
            sqlHistorico = selectHistoricoCompleto + whereFiltro + orderHistorico;
        } else {
            sqlHistorico = selectHistoricoCompleto + orderHistorico;
        }

        Firebird.attach(options, function (err, db) {

            db.query(sqlHistorico, param, function (err, result) {
                // IMPORTANT: close the connection
                db.detach();

                if (err) {
                    errors.erro_interno_query(res);
                    return;
                }

                res.status(200);
                res.send(result);

            });


        });


    },


    /**
     * @param historicoPedidoDet {HistoricoPedidoDet}
     * @param res {Response}
     * @param amb {string}
     */
    det: (amb, historicoPedidoDet, res) => {

        // VALIDAÇÃO DE AMBIENTE
        var options = controller.getOptions(amb);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        let param = [];
        param = historicoPedidoDet.id;

        Firebird.attach(options, function (err, db) {


            db.query(sqlHistoricoDet, param, function (err, result) {
                // IMPORTANT: close the connection
                db.detach();

                if (err) {
                    errors.erro_interno_query(res);
                    return;
                }

                res.status(200);
                res.send(result);

            });


        });


    },


}


let selectHistoricoCompleto = "select ID,ID_CLIENTE,ID_VENDEDOR,ID_FORMA_PAGAMENTO, DATA_EMISSAO,VALOR_PRODUTOS,VALOR_DESCONTO,VALOR_TOTAL from mob_historico_cab a " +
    " where  a.id_cliente in (select * from SP_UTIL_INTEGER_LIST(?) )";


let selectHistoricoParcial = "select ID,ID_CLIENTE,ID_VENDEDOR,ID_FORMA_PAGAMENTO, DATA_EMISSAO,VALOR_PRODUTOS,VALOR_DESCONTO,VALOR_TOTAL from mob_historico_cab a " +
    " where  a.id_cliente in (select * from SP_UTIL_INTEGER_LIST(?) )";

let orderHistorico = " order by a.id_cliente, a.id";

let sqlHistoricoDet = "select ID,ID_VENDA_CAB,ID_PRODUTO,QUANTIDADE,VALOR_DESCONTO,VALOR_UNITARIO,VALOR_TOTAL,STATUS, BRINDE, DATA_SINCRONIZACAO from mob_historico_det a where a.id_venda_cab in (select * from SP_UTIL_INTEGER_LIST(?) )"

let sqlHistoricoDetLite = "select ID,ID_VENDA_CAB,ID_PRODUTO,QUANTIDADE,VALOR_DESCONTO,VALOR_UNITARIO,VALOR_TOTAL,STATUS, BRINDE, DATA_SINCRONIZACAO from mob_historico_det a where a.id_venda_cab in (select * from SP_UTIL_INTEGER_LIST(?) )"
