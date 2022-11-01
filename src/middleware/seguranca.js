const errors = require('../common/error');
const Firebird = require("node-firebird");
const ambiente = require('../managers/server_controller');
const e = require("express");

const {header, body} = require('express-validator');
const {validation_form, validation_ambiente} = require("./validator");

/**
 *
 * @param req
 * @param res
 * @param next {Function}
 * @return {Promise<unknown>}
 */
function device(req, res, next) {

    let headers = req.headers;

    let options = ambiente.getOptions(headers.ambiente);
    let param = [headers.uuid, headers.idvendedor]


    Firebird.attach(options, function (err, db) {

        // Problemas de conexão
        if (err) {
            console.log(err)
            return res.status(421).end();
        }

        db.query(sql, param, (err, result) => {
            db.detach();

            if (err) {
                return res.status(421).end();
            }
            next()
        })

    })


}

let reqCheck = [
    header('ambiente')
        .exists()
        .isLength({min: 1, max: 100}),
    header('idvendedor')
        .exists()
        .isNumeric(),
    // header('device')
    //     .exists(),
    header('uuid')
        .exists(),
    // header('ip'),
];


// let reqCheck = [
//     header('ambiente')
//         .exists()
//         .isLength({min: 1, max: 100}),
//     header('idvendedor')
//         .exists()
//         .isNumeric(),
//     // header('device')
//     //     .exists(),
//     header('uuid')
//         .exists(),
//     // header('ip'),
// ];


module.exports = {

    /**
     * @param {Headers} user
     * device é o código único do dispositivo
     */
    checkDevice: [validation_ambiente, reqCheck, validation_form, device]
}




let sql = 'SELECT * FROM MOB_VW_DISPOSITIVO_USUARIO WHERE UUID = ? AND ID_USUARIO = ?'