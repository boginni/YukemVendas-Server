const crypto = require('crypto');
const Firebird = require("node-firebird");
const serverConfig = require("../../managers/server_controller");
const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const seguranca = require('../../common/seguranca');

const fs = require('fs');

const zlib = require('zlib');
const e = require("express");
const {timeUtility} = require("../../common/utility");


let lastFileIndex = 0;

module.exports = {

    /**
     * @param viewRequest {ViewRequest}
     * @param res {Response}
     */
    info: (viewRequest, res) => {
        var options = serverConfig.getOptions(viewRequest.ambiente);


        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res)
            return null;
        }

        let sql = ""
        let param = [];

        sql = 'SELECT count(*) quantidade  FROM ' + viewRequest.tb + ' '

        if (viewRequest.data) {
            sql += ' where data_last_update >= ?';
            param.push(viewRequest.data);
        }

        sql += ";";

        Firebird.attach(options, function (err, db) {

            if (err) {
                console.log(err);
                errors.erro_interno_fb(res);
                return;
            }


            db.query(sql, param, function (err, result) {
                // IMPORTANT: close the connection
                db.detach();

                if (err) {
                    console.log(err);
                    errors.erro_interno_query(res);
                    return;
                }

                res.status(200);
                res.send(result[0]);

            });


        });


    },

    /**
     * @param viewRequest {ViewRequest}
     * @param req {Request}
     * @param res {Response}
     */
    download: async (req, res) => {

        let ambiente = req.headers.ambiente;
        let options = serverConfig.getOptions(ambiente);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }


        // language=SQL format=false


        let views = req.body.views;
        // let param = req.body.last;
        let param = [];

        let result = {};

        Firebird.attach(options, async function (err, db) {

            if (err) {
                errors.erro_interno_fb(res);
                return;
            }


            for (const view of views) {

                // language=SQL format=false
                let sql = `SELECT * FROM ${view}`;

                console.log(sql)

                let resultSet = await new Promise((resolve, reject) => {
                    db.query(sql, param, function (err, result) {
                        // IMPORTANT: close the connection
                        if (err) {
                            resolve(err)
                            return;
                        }
                        resolve(result)
                    });
                });


                result[view] = resultSet;

            }

            db.detach();
            saveZipSend(result, ambiente, 'old.gz', res)


            // res.send(result)

        })
    },

    getViewContent: async (req, res) => {

        // send('./files/altogiro/sync/views-4502.gz', res);
        // return;

        // console.log(req.body)

        try {

            let ambiente = req.headers.ambiente;

            let options = serverConfig.getOptions(ambiente);

            if (options === null) {
                errors.invalido_ambiente(res);
                return null;
            }

            if (!(await seguranca.checkDevice(req.headers))) {
                errors.acesso_negado(res);
                return null;
            }

            // if (!(await seguranca.checkDevice(req.headers))) {
            //     errors.acesso_negado(res);
            //     return null;
            // }

            /**
             *
             * @type {{}}
             */
            let normalViews = req.body.views.normal;
            let rotaViews = req.body.views.rota;
            let rota = req.body.rota;
            let vendedor = req.body.vendedor;


            // console.log(req.body)

            console.log(`(${vendedor}) - View Request`)


            Firebird.attach(options, async (err, db) => {

                let normalResults = {};
                let rotaResults = {};

                let currentTime = timeUtility.getTimeStamp();

                for (let view in normalViews) {
                    if (allowedViews[view]) {
                        // language=SQL format=false
                        let sql = `SELECT * FROM ${view}`;
                        let param = normalViews[view];


                        if (param !== undefined && param !== null) {
                            sql += ` where DATA_LAST_UPDATE >= ?`;
                        }

                        sql += ';'

                        normalResults[view] = await getViewData(db, view, sql, param);

                        continue;
                    }

                    normalResults[view] = 'Forbidden';


                }

                if (vendedor !== null && vendedor !== undefined) for (let view of rotaViews) {

                    if (allowedViews[view]) {
                        // language=SQL format=false
                        let sql = `SELECT * FROM ${view} where RT_VENDEDOR = ? `;
                        let param = [vendedor];
                        if (rota !== null && rota !== undefined) {
                            sql += ' and RT_ROTA = ?;'
                            param.push(req.headers.rota);
                        }
                        rotaResults[view] = await getViewData(db, view, sql, param);
                        continue;
                    }

                    normalResults[view] = 'Forbidden';


                }


                let result = {
                    "time": currentTime, "views": {
                        "normal": normalResults, "rota": rotaResults
                    }
                };

                db.detach();
                saveZipSend(result, ambiente, `views-${vendedor}.gz`, res)
            })

        } catch (e) {
            console.log(req.body);
            console.log(e);
            errors.invalido_body(res);

        }
    },

}


function saveZipSend(result, ambiente, fileName, res) {

    let dir = `./files/${ambiente}/sync/`;
    let filePath = dir + fileName;

    fs.mkdirSync(dir, {recursive: true});

    zlib.gzip(JSON.stringify(result), function (err, data) {
        if (err) {
            console.log("error in gzip compression using zlib module", err);
            throw 'Crash forçado por erro ao tentar salvar arquivo de sincronização'

        } else {

            fs.writeFileSync(filePath, data)
            send(filePath, res);

        }
    })
}


function send(filePath, res) {
    res.writeHead(200, {
        "Content-Type": "application/octet-stream",
        'Content-Length': fs.statSync(filePath).size,
        "Content-Disposition": "attachment; filename=" + 'sync.gz'
    });
    fs.createReadStream(filePath).pipe(res);
}

/**
 *
 * @param db {Firebird.Database}
 * @param viewName {String}
 * @param sql {String}
 * @param param {[]}
 * @return {Promise<unknown>}
 */
async function getViewData(db, viewName, sql, param) {

    return await new Promise((resolve, reject) => {

        query.simple2(db, viewName, sql, err => {
            reject(err);
        }, (err, resultSet) => {
            if (err) {
                reject(err);
                return;
            }
            resolve(resultSet);
        }, param);
    });

}

/**
 * @return boolean
 * @param viewRequest {ViewRequest}
 */
function validateBody(viewRequest) {

    if (viewRequest.tb == null) {
        return false;
    }

    if (viewRequest.data == null) {
        return false;
    }

    let test = !(viewRequest.skip == null ^ viewRequest.limit == null);

    return test;
}

/// Lista de tabelas que é permitido, isso evita sql injection
let allowedViews = {};
allowedViews["MOB_VW_UF"] = true;
allowedViews["MOB_VW_CIDADE"] = true;
allowedViews["MOB_VW_CLIENTE"] = true;
allowedViews["MOB_VW_ROTA"] = true;
allowedViews["MOB_VW_CLIENTE_ROTA"] = true;
allowedViews["MOB_VW_GRUPO"] = true;
allowedViews["MOB_VW_DEPARTAMENTO"] = true;
allowedViews["MOB_VW_SUB_GRUPO"] = true;
allowedViews["MOB_VW_UNIDADE"] = true;
allowedViews["MOB_VW_PRODUTO"] = true;
allowedViews["MOB_VW_TABELA_PRECO"] = true;
allowedViews["MOB_VW_TABELA_PRECO_PRODUTO"] = true;
allowedViews["MOB_VW_TABELA_PRECO_QT"] = true;
allowedViews["MOB_VW_FORMA_PAGAMENTO_TIPO"] = true;
allowedViews["MOB_VW_FORMA_PAGAMENTO"] = true;
allowedViews["MOB_VW_VENDEDOR"] = true;
allowedViews["MOB_VW_COMISSAO_DIARIA"] = true;
allowedViews["MOB_VW_VENDEDOR_ROTA"] = true;
allowedViews["MOB_VW_CONF_AMBIENTE"] = true;
allowedViews["MOB_VW_CIDADE_ROTA"] = true;
allowedViews["MOB_VW_CONTATO_TIPO"] = true;
allowedViews["MOB_VW_CONTATO"] = true;
allowedViews["MOB_VW_COMODATO_CAB"] = true;
allowedViews["MOB_VW_COMODATO_DET"] = true;
allowedViews["MOB_VW_TITULOS_ABERTO"] = true;
allowedViews["MOB_VW_CLIENTE_VENDEDOR"] = true;
allowedViews["MOB_VW_CONF_CADASTRO_CAMPO"] = true;
allowedViews["MOB_VW_MOTIVO_CANCELAMENTO"] = true;
allowedViews["MOB_VW_BLOQUEIO_PG_TIPO"] = true;
allowedViews["MOB_VW_CLIENTE_TIPO"] = true;
allowedViews["MOB_VW_CONF_AMBIENTE_USER"] = true;
//
allowedViews["MOB_VW_COMODATO_CAB_ROTA"] = false;
allowedViews["MOB_VW_COMODATO_DET_ROTA"] = false;
allowedViews["MOB_VW_TITULO_ABERTO_ROTA"] = true;
allowedViews["MOB_VW_HISTORICO_CAB_ROTA"] = true;
allowedViews["MOB_VW_HISTORICO_DET_ROTA"] = true;



