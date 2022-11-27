const Firebird = require("node-firebird");
const ambiente = require('../../managers/server_controller');
const errors = require('../../common/error');
const seguranca = require('../../middleware/seguranca');


module.exports = {
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     */
    insertVisita: async (req, res) => {


        let headers = req.headers;
        let options = ambiente.getOptions(headers.ambiente);
        let visitaList = req.body;
        if (visitaList.length == null || visitaList.empty) {
            res.sendStatus(200)
            return null;
        }

        let retList = [];

        Firebird.attach(options, async function (err, db) {

            if (err) {
                errors.erro_interno_fb(res)
                return;
            }

            console.log('log visita');
            console.log(visitaList);

            for (let visita of visitaList) {

                let rota = visita.ID_ROTA;

                if (rota == 0) {
                    rota = null;
                }


                let params = [
                    visita.UUID,
                    visita.ID_CLIENTE,
                    visita.ID_VENDEDOR,
                    rota,
                    visita.ID_CANCELAMENTO,
                    visita.ID_BASE_CAB,
                    visita.DATA_CHEGADA,
                    visita.OBSERVACAO_CANCELAMENTO
                ]

                let exists = await new Promise(resolve => {
                    db.query(sqlQuery, [visita.UUID], (err, result) => {
                        if (err) {
                            return;
                        }

                        if (result.length > 0) {
                            resolve(true);
                            return
                        }

                        resolve(false);
                    })
                });


                if (!exists) {
                    await new Promise(resolve => {
                        db.query(sqlInsert, params, (err) => {
                            if (err) {
                                console.log(err)
                                throw 'sql error'
                            }

                            retList.push(visita.UUID);
                            return resolve()
                        })
                    });
                } else {
                    retList.push(visita.UUID);
                }

            }

            db.detach()
            res.status(200)


            console.log('sending results');
            console.log(retList);

            res.send(retList)
        })
    }
}

let sqlInsert = 'INSERT INTO MOB_VISITA (ID_EMPRESA, UUID, ID_CLIENTE, ID_VENDEDOR, ID_ROTA, ID_CANCELAMENTO,     ID_BASE_CAB, DATA_CHEGADA, OBSERVACAO_CANCELAMENTO) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?);'


let sqlQuery = 'select * from mob_visita a where a.uuid = ?'



