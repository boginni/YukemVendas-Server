const errors = require('./error');
const Firebird = require("node-firebird");
const ambiente = require('../managers/server_controller');
const e = require("express");

module.exports = {

    /**
     *
     * @param {Headers} user
     * device é o código único do dispositivo
     */
    checkDevice: async (headers) => {



        /**
         * @type {User}
         */
        let user = {}
        user.ambiente = headers.ambiente
        user.idvendedor = headers.idvendedor
        user.device = headers.device
        user.lastUUID = headers.uuid
        user.ip = headers.ip


        var options = ambiente.getOptions(user.ambiente);

        return new Promise((resolve, reject) => {

            function isValid(value){
                return value != undefined && value != null;
            }

            // Verifica se o código enviado é nulo
            if (!(isValid(user.lastUUID) && isValid(user.idvendedor))) {
                resolve(false);
                return false;
            }


            let param = [user.lastUUID, user.idvendedor]


            Firebird.attach(options, function (err, db) {

                // Problemas de conexão
                if (err) {
                    console.log(err)
                    resolve(false);
                    return;
                }

                db.query(sql, param, (err, result) => {
                    db.detach();

                    if (err) {
                        console.log('erro')
                        console.log(err)
                        resolve(false);
                        return;
                    }

                    resolve(result.length > 0);


                })

            })

        })


    }

}


let sql = 'SELECT * FROM MOB_VW_DISPOSITIVO_USUARIO WHERE UUID = ? AND ID_USUARIO = ?'