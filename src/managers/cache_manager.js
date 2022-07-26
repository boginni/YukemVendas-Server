const Firebird = require("node-firebird");
const ambiente = require('./server_controller');

const segundo = 1000;

const minuto = segundo * 60;

const hora = minuto * 60;


module.exports = {

    salvarComissao,

    salvarHistorico,

    salvarTitulos,

    updateCache: () => {

        let i = 0;

        for (const amb of ambiente.getAmbientes()) {

            setTimeout(
                function () {

                    console.log(`Atualizando cache em ${amb}`)
                    atualizarCache(amb);

                    setInterval(
                        function () {
                            atualizarCache(amb);
                        }, (hora * 6));
                }, 5 * segundo + minuto * i
            );

            i++

        }

    }


}

/** @amb {String} */
function salvarComissao(amb) {
    executar(amb, 'Comissão', 'EXECUTE PROCEDURE SP_MOB_SALVAR_COMISSAO', [])
}

/** @amb {String} */
function salvarTitulos(amb) {
    executar(amb, 'Títulos', 'EXECUTE PROCEDURE SP_MOB_SALVAR_TITULOS', [])
}

/** @amb {String} */
function salvarHistorico(amb) {
    executar(amb, 'Historico', 'EXECUTE PROCEDURE SP_MOB_SALVAR_HISTORICO_PEDIDO(?, ?);', [5, null])
}


function executar(amb, apelido, procedure, params) {

    // console.log(`Iniciado ${apelido} para ` + amb);
    var options = ambiente.getOptions(amb);

    // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
    if (options == null) {
        console.log('Ambiente Inválido');
        return null;
    }


    Firebird.attach(options, function (err, db) {
        // Problemas de conexão
        if (err) {
            console.log(err);
            console.log('Erro Firebird em ' + amb);
            return;
        }

        db.execute(procedure, params, function (err, result) {
            db.detach();

            if (err) {
                console.log('Erro na procedure ' + apelido + ' em ' + amb);
            } else {
                console.log(`Atualizada ${apelido} do ${amb}`);
            }


        })
    })
}


function atualizarCache(amb) {

    let i = 0;

    i++

    salvarComissao(amb);

    setTimeout(
        function () {
            salvarHistorico(amb);
        }, 10 * segundo * i
    );

    setTimeout(
        function () {
            salvarTitulos(amb);
        }, 10 * segundo * i
    );

}