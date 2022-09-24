// const seguranca = require("../middleware/seguranca");
const {header, body} = require("express-validator");
const {validation_form} = require("../../middleware/validator");


const meta = require('../../dao/dashboard/web/dao_web_meta_gerenciar')


function finish(req, res) {
    res.status(200).end()
}


function d(req, res, next) {

    req.headers.ambiente = 'altogiro';
    req.headers.user_id = '1';
    req.headers.user_uuid = '';

    next();
}

/**
 *
 * @param req {Request}
 * @param res {Response}
 * @param next
 */
function form(req, res, next) {
    console.log('requisição em ', req.path)
    // res.send('mid');
    next();
}

let bodyHeader = [
    body('apelido')
        .exists(),
    body('diasUteis')
        .exists()
        .isNumeric(),
    body('diasDecorridos')
        .exists()
        .isNumeric(),
    body('diasRestantes')
        .exists()
        .isNumeric(),
    body('dataInicio')
        .exists()
        .isDate(),
    body('dataFim')
        .exists()
        .isDate(),
];


let idMeta = [
    body('id_meta')
        .exists()
        .isNumeric(),
]

let copy = [
    body('id_meta_copy')
        .exists()
        .isNumeric(),
    body('id_meta_paste')
        .exists()
        .isNumeric(),
]


let idMetaVendedor = [
    body('id_meta')
        .exists()
        .isNumeric(),
    body('id_vendedor')
        .exists()
        .isNumeric(),
]

// "id_meta_item" : {{id_meta_item}} ,
// "id_produto" : 1,
//     "quantidade" : 2

let itemEdit = [
    body('id_meta_item')
        .exists()
        .isNumeric(),
    body('id_produto')
        .exists()
        .isNumeric(),
    body('quantidade')
        .exists()
        .isNumeric(),
]

let itemRemove = [
    body('id_meta_item')
        .exists()
        .isNumeric(),
]

let idMetaProduto = [
    body('id_meta')
        .exists()
        .isNumeric(),
    body('id_produto')
        .exists()
        .isNumeric(),
]


module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {


        app.post('/dash/web/meta/gerenciar/list', d, validation_form, meta.header.list);

        app.post('/dash/web/meta/gerenciar/add', d, bodyHeader, validation_form, meta.header.add);

        app.post('/dash/web/meta/gerenciar/edit', d, [...bodyHeader, idMeta], validation_form, meta.header.edit);

        app.post('/dash/web/meta/gerenciar/copy', d, copy, validation_form, meta.header.copy);

        app.post('/dash/web/meta/gerenciar/remove', d, idMeta, validation_form, meta.header.remove);

        app.post('/dash/web/meta/gerenciar/vendedor/list', d, idMeta, validation_form, meta.vendedor.list);

        app.post('/dash/web/meta/gerenciar/item/list', d, idMetaVendedor, validation_form, meta.item.list);

        app.post('/dash/web/meta/gerenciar/item/add', d, idMetaVendedor, validation_form, meta.item.add);

        app.post('/dash/web/meta/gerenciar/item/edit', d, itemEdit, validation_form, meta.item.edit);

        app.post('/dash/web/meta/gerenciar/item/remove', d, itemRemove, validation_form, meta.item.remove);

        app.post('/dash/web/meta/total/list', d, idMeta, validation_form, meta.total.list);

        app.post('/dash/web/meta/total/vendedor', d, idMetaProduto, validation_form, meta.total.listVendedor);


    }

}


