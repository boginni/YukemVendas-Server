const Firebird = require("node-firebird");
const ambiente = require('../../managers/server_controller');
const errors = require('../../common/error');
const daoIp = require('../../common/ip_storage');
const seguranca = require('../../common/seguranca');
const userManager = require('../../managers/user_manager');

var crypto = require('crypto');

let sql = 'SELECT * FROM MOB_SP_YK_LOGIN(?, ?);';

module.exports = {
    /**
     * @param req {Request}
     * @param res {Response}
     */
    login: (req, res) => {

        // REQUESTS
        var amb = req.headers.ambiente;
        var usuario = req.body.usuario;
        var pass = req.body.pass;
        var device = req.headers.device;
        var ip = req.ip

        // VALIDAÇÃO PARA EVITAR NULL
        if (!validateLogin(amb, usuario, pass)) {
            errors.invalido_credencial(res);
            return;
        }

        var options = ambiente.getOptions(amb);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        // Converte a senha para MD5
        let hash = crypto.createHash('md5').update(usuario + pass).digest('hex');


        console.log(hash)

        Firebird.attach(options, function (err, db) {

            // Problemas de conexão
            if (err) {
                errors.erro_interno_fb(res)
                return;
            }

            db.query(sql, [usuario, hash], function (err, result) {
                // IMPORTANT: close the connection
                db.detach();

                if (err) {
                    errors.erro_interno_fb(res);
                    console.log(err);
                    return;
                }

                // SENHA ERRADA
                if (result.length === 0) {
                    errors.invalido_senha(res);
                    return;
                }


                res.status(200);
                let response = result[0];

                /**
                 *
                 * @type {Credencial}
                 */

                    // JSON SIMPLES DE CONTROLE
                let user = {};

                user.ambiente = amb;
                user.user = usuario;
                user.idVendedor = response.ID_VENDEDOR;
                user.lastUUID = response.LAST_UUID;
                user.ip = ip;
                user.device = device//response.codigo_dispositivo;
                // seguranca.checkDevice(user, res);

                userManager.addUser(user);
                daoIp.saveIp(user, res);

                response.port = ambiente.getServerConfig().portaIn;

                res.send(JSON.stringify(response));
            });

        });

    },


}

/**
 * @param ambiente {string}
 * @param usuario {string}
 * @param pass {string}
 * @return boolean
 */
function validateLogin(ambiente, usuario, pass) {

    if (ambiente == null) {
        return false;
    }

    if (usuario == null) {
        return false;
    }

    return pass != null;

}
















