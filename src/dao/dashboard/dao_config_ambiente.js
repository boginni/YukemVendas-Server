const controller = require("../../managers/server_controller");
const Firebird = require("node-firebird");
const errors = require("../../common/error");

const seguranca = require('../../common/seguranca');

module.exports = {

    /**
     * @param request {Request}
     * @param res {Response}
     */
    update: async (request, res) => {


        // VALIDAÇÃO DE AMBIENTE
        var options = controller.getOptions(request.ambiente);


        if (options == null) {
            errors.invalido_ambiente(res);
            return;
        }

        if (!(await seguranca.checkDevice(request.headers))) {
            errors.acesso_negado(res);
            return;
        }

        let param = [request.valor, request.id];

        // ACESSO AO BANCO DE DADOS
        Firebird.attach(options, async function (err, db) {

            // ERRO INTERNO FB
            if (err) {
                errors.erro_interno_fb(res)
                return;
            }

            db.query(sqlUpdate, param, function (err, result) {
                if (err) {
                    console.log(err)
                    errors.erro_interno_query(res)
                } else {
                    res.status = 200;
                    res.send('ok');
                }
            });


        });


    }


}


const sqlUpdate = 'update MOB_CONF_AMBIENTE A set A.VALOR = ? where A.ID = ?;'