/**
 * IMPORTS NECESSÁRIOS PARA EXECUÇÃO DO DAO CLIENTE
 */

const Firebird = require("node-firebird");
const controller = require('../../managers/server_controller');
const errors = require('../../common/error');


// const
const log = require("../../common/log_manager");

module.exports = {

    /**
     * DECLARAÇÃO DOS PARÂMETROS GERAIS
     *
     * @param req {Request}
     * @param res {Response}
     */

    // FUNCTION INSERT CLIENTE
    insert: async (req, res) => {
        let headers = req.headers;
        let amb = req.headers.ambiente;
        /**
         * @type {Pessoa[]}
         */
        let clientList = req.body;

        let options = controller.getOptions(amb);

        Firebird.attach(options, async function (err, db) {

            // ERRO INTERNO FB
            if (err) {
                errors.erro_interno_fb(res)
                return;
            }

            let retList = {};

            for (let i = 0; i < clientList.length; i++) {

                let cliente = clientList[i];

                let clienteCheck = await new Promise((resolve, reject) => {

                        db.query(sqlCheckCliente, [cliente.idintegracao], function (err, result) {
                            if (err) {
                                resolve(errors.invalido_tabela(null))
                            } else {
                                if (result.length > 0) {
                                    resolve(result[0].ID);
                                } else {
                                    resolve(null)
                                }
                            }
                        });

                    }
                )

                if (typeof clienteCheck == 'number') {
                    retList[cliente.idintegracao] = clienteCheck;
                    continue;
                }


                retList[cliente.idintegracao] = await new Promise((resolve) => {


                    if (cliente.idCidade === 0) {
                        cliente.idCidade = 5565;
                    }

                    let allParams = [
                        cliente.idsync, cliente.tipopessoa, cliente.nome, cliente.razao, cliente.cpfcnpj, cliente.email,
                        cliente.dddtelefone, cliente.telefone, cliente.cep, cliente.endereco, cliente.numero,
                        cliente.bairro, cliente.complemento, cliente.idusuario, cliente.inscricaoestadual,
                        cliente.idtabelapreco, cliente.idformapg, cliente.idintegracao, cliente.dddcelular,
                        cliente.celular, cliente.whatsapp, cliente.datanascimento, cliente.rg,
                        cliente.idCidade, cliente.idrota, cliente.observacao, cliente.sexo, cliente.idtipo
                    ];

                    if (options.caixaAlta) {
                        for (const allParamsKey in allParams) {

                            let field = allParams[allParamsKey];

                            if ((typeof field) == 'string') {
                                allParams[allParamsKey] = field.toUpperCase();
                            }

                        }
                    }

                    db.query(sqlInsertClient, allParams, function (err, result) {
                        if (err) {
                            resolve(errors.invalido_tabela(null))
                        } else {
                            log.logSaveCliente(cliente, amb)
                            resolve(result[0].ID);
                        }
                    });

                });


            }

            db.detach();
            res.status = 200;
            res.send(JSON.stringify(retList));
        });

    },
}

const sqlInsertClient = 'SELECT * FROM MOB_SP_ADD_CLIENTE( ?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?) ';
const sqlCheckCliente = 'select * from CB_CLIENTE A WHERE A.ID_INTEGRACAO = ?;';

    
