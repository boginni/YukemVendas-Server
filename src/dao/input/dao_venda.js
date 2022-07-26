const Firebird = require("node-firebird");
const ambiente = require('../../managers/server_controller');
const errors = require('../../common/error');
const seguranca = require('../../common/seguranca');

const {logSaveVenda} = require("../../common/log_manager");
let logRet = [];

module.exports = {

    /**
     * @param req {Request}
     * @param res {Response}
     */
    adicionar: async (req, res) => {


        let headers = req.headers;

        var options = ambiente.getOptions(headers.ambiente);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        if (!(await seguranca.checkDevice(headers))) {
            errors.acesso_negado(res);
            return null;
        }

        Firebird.attach(options, async function (err, db) {

            if (err) {
                errors.erro_interno_fb(res);
                return;
            }

            // Mapa de retorno
            let retList = {};

            // Quantidade
            let qtd = 0;

            let vendaList = req.body;

            for (let i = 0; i < vendaList.length; i++) {
                let venda = vendaList[i];

                //ITEM do mapa de retorno
                let ret = {};

                ret.cab = {};
                ret.det = [];

                // Adiciona o item

                let vendaTest = await vendaExiste(db, venda.cab.uuid);

                if (vendaTest != null) {
                    console.log('venda já existe');
                    ret.cab.error = 'Venda já existe';
                    retList[venda.cab.uuid] = vendaTest;
                    continue;
                }

                let vendaInserida = await new Promise((resolve, reject) => {

                    db.transaction(Firebird.ISOLATION_READ_COMMITED, async (err1, transaction) => {

                        let vendaResponse = await insertVendaCab(transaction, venda.cab);

                        if (vendaResponse === 'error') {
                            console.log('Erro na venda');
                            resolve(false);
                            transaction.rollback();
                            return;
                        }

                        if (vendaResponse === 'noti') {
                            console.log('Venda Bloqueada por parâmetro');
                            resolve(false);
                            transaction.rollback();
                            return;
                        }

                        ret.cab.id = vendaResponse;

                        if (ret.cab.id != null) {
                            // insere os Produtos do pedido
                            for (let j = 0; j < venda.det.length; j++) {
                                venda.det[j].ID_VENDEDOR = venda.cab.idvendedor;
                                let item = await insertVendaDet(transaction, ret.cab.id, venda.det[j]);
                                ret.det.push(item);
                            }

                        }

                        transaction.commit(function (err) {
                            if (err) {
                                transaction.rollback();
                                resolve(false);
                            } else {
                                qtd++;
                                resolve(true);
                            }
                        });

                    })
                })

                if (vendaInserida) {
                    logSaveVenda(venda, headers.ambiente);
                    await verificaVenda(db, ret.cab.id);
                    retList[venda.cab.uuid] = ret.cab.id;
                }

            }

            db.detach();
            res.status(200);
            res.send(retList);


        });

    },

    pingar: async (req, res) => {

        let headers = req.headers;

        var options = ambiente.getOptions(headers.ambiente);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        if (!(await seguranca.checkDevice(headers))) {
            errors.acesso_negado(res);
            return null;
        }


        Firebird.attach(options, async function (err, db) {


            db.query('select * from MOB_CONF_AMBIENTE a where a.id = 42', [], (err1, result) => {
                    db.detach();
                    res.status(200);
                    res.send(result[0]['VALOR']);
                }
            )


        });

    },

}


/**
 * @param db {Database}
 * @param uuid {string}
 * @return {Promise<boolean>}
 */
async function vendaExiste(db, uuid) {
    return await new Promise((resolve) => {

        let param = [uuid];

        db.query(sqlVendaExiste, param, function (err, result) {
            if (err) {
                errors.erro_interno_fb(res);
                return;
            }
            if (result.length > 0) {
                resolve(result[0]['ID'])
            } else {
                resolve(null)
            }

        });


    })
}


/**
 * @param db {Database}
 * @param cab {VendaCab}
 * @return {Promise<int>}
 */
async function insertVendaCab(db, cab) {
    return await new Promise((resolve) => {

        let param = [cab.idempresa, cab.idcliente, cab.idvendedor, cab.idtabela, cab.idformaPagamento, cab.uuid, cab.totalpedido, cab.valordesconto,
            cab.observacao, cab.data, cab.hora, cab.observacaoentrega, cab.datapreventrega, cab.totalliquido, cab.valorentrada, cab.valorrestante];

        db.query(sqlCab, param, function (err, result) {
            if (err) {
                console.log(err);
                resolve('error');
            } else {

                if (result.length === 0) {
                    resolve('noti');
                } else {
                    resolve(result[0]['ID']);
                }


            }
        });

    })
}

/**
 * @param db {Database}
 * @param idPedido {int}
 * @param det {VendaDet}
 * @return {Promise<null>}
 */
async function insertVendaDet(db, idPedido, det) {
    return await new Promise((resolve) => {

        let param = [idPedido, det.ID_EMPRESA, det.ID_PRODUTO, det.ID_VENDEDOR, det.QUANTIDADE, det.VALOR_UNITARIO, det.VALOR_TOTAL, det.VALOR_DESCONTO, det.OBSERVACAO, det.A_BRINDE];


        db.query(sqlDet, param, function (err, result) {

            if (err) {
                console.log(err);
                errors.erro_interno_query(res);
                resolve();
            }
            resolve(result[0]);

        });

    });
}


async function verificaVenda(db, idPedido) {

    return await new Promise((resolve) => {

        // let param = [idPedido, det.ID_EMPRESA, det.ID_PRODUTO, det.ID_VENDEDOR, det.QUANTIDADE, det.VALOR_UNITARIO, det.VALOR_TOTAL, det.VALOR_DESCONTO, det.OBSERVACAO, det.A_BRINDE];

        let param = [idPedido];

        // logRet = {
        //     'idpedido': idPedido, 'idempresa': det.ID_EMPRESA, 'produto': det.ID_PRODUTO, 'idvendedor': det.ID_VENDEDOR,
        //     'quantidade': det.quantidade, 'valorunitario': VALOR_UNITARIO, 'valortotal': det.VALOR_TOTAL,
        //     'valordesconto': det.VALOR_DESCONTO, 'observacao': det.OBSERVACAO, 'brinde': det.A_BRINDE
        // }

        db.query(sqlVerifica, param, function (err, result) {

            if (err) {
                console.log(err);
                resolve();
            }
            resolve();

        });

    });
}

const sqlVerifica = 'select RESULT from SP_VERICA_VALOR_VENDA_CAB(?, 1);'

const sqlCab = ' SELECT ID FROM SP_MOB_INSERT_PEDIDO ( ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ) ';

const sqlVendaExiste = 'select id from FAT_VENDA_CAB f where f.id_integracao = ?';

const sqlDet = 'EXECUTE PROCEDURE SP_INSERT_VENDA_DET_UMOV ( ? , ?, ?, ? , ?, ? , ? , ? , ?, ? ) ;';



