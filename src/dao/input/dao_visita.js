const Firebird = require("node-firebird");
const ambiente = require('../../managers/server_controller');
const errors = require('../../common/error');
const seguranca = require('../../common/seguranca');


module.exports = {
    /**
     *
     * @param {Request} req
     * @param {Response} res
     * @returns
     */
    insertVisita: async (req, res) => {


        let headers = req.headers;

        // VALIDAÇÃO DE AMBIENTE
        let options = ambiente.getOptions(headers.ambiente);

        // SERVE PARA VERIFICAR SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }


        if (!(await seguranca.checkDevice(headers))) {
            errors.acesso_negado(res);
            return
        }


        let visitaList = req.body;

        if (visitaList.length == null || visitaList.empty) {
            res.sendStatus(200)
            return null;
        }

        let retList = [];

        // ACESSO AO BANCO DE DADOS
        Firebird.attach(options, async function (err, db) {
            // ERRO INTERNO FB
            if (err) {
                errors.erro_interno_fb(res)
                return;
            }
            for (let visita of visitaList) {

                let params = [
                    visita.UUID,
                    visita.ID_CLIENTE,
                    visita.ID_VENDEDOR,
                    visita.ID_ROTA,
                    visita.ID_CANCELAMENTO,
                    visita.ID_BASE_CAB,
                    visita.DATA_CHEGADA,
                    visita.OBSERVACAO_CANCELAMENTO
                ]

                // console.log(visita)

                db.query(sql, params, (err) => {
                    if (err) {
                        return;
                    }

                    retList.push(visita.UUID);

                })


            }

            db.detach()

            // res.sendStatus(200)
            res.send(retList)
        })
    }
}

let sql = 'INSERT INTO MOB_VISITA (ID_EMPRESA, UUID, ID_CLIENTE, ID_VENDEDOR, ID_ROTA, ID_CANCELAMENTO,     ID_BASE_CAB, DATA_CHEGADA, OBSERVACAO_CANCELAMENTO) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?);'