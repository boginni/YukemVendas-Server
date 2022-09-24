const errors = require('../../../common/error');
const query = require('../../../common/query_buffer');
const {getOptions} = require("../../../managers/server_controller");

module.exports = {

    header: {

        /**
         * @param req {Request}
         * @param res {Response}
         */
        list: async (req, res) => {


            const tb = 'DASH_VW_META';
            // language=SQL format=false
            const sql = `SELECT * FROM ${tb};`;

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, [req.body.id_meta])


        },

        /**
         * @param req {Request}
         * @param res {Response}
         */
        add: async (req, res) => {
            res.status(200);

            // language=SQL format=false
            const sql = `INSERT INTO DASH_META_VENDA 
    (APELIDO, DIAS_UTEIS, DIAS_DECORRIDOS, DIAS_RESTANTES, DATA_INICIO, DATA_FIM, STATUS_ATIVO) 
    VALUES (?, 1, 0, 0, '1-AUG-2022', '30-SEP-2022', 1);`;
            let param = [req.body.apelido, // req.body.diasUteis,
                // req.body.diasDecorridos,
                // req.body.diasRestantes,
                // req.body.dataInicio,
                // req.body.dataFim,
            ];
            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)
        },

        /**
         * @param req {Request}
         * @param res {Response}
         */
        edit: async (req, res) => {
            // language=SQL format=false
            const sql = `
            UPDATE DASH_META_VENDA
                SET APELIDO = ?,
                    DIAS_UTEIS = ?,
                    DIAS_DECORRIDOS = ?,
                    DIAS_RESTANTES = ?,
                    DATA_INICIO = ?,
                    DATA_FIM = ?
                WHERE (ID = ?);
        `;
            let param = [req.body.apelido, req.body.diasUteis, req.body.diasDecorridos, req.body.diasRestantes, req.body.dataInicio, req.body.dataFim, req.body.id_meta,];
            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)
        },

        /**
         * @param req {Request}
         * @param res {Response}
         */
        copy: async (req, res) => {

            // language=SQL
            const sql = `
                execute procedure dash_sp_meta_copy(?, ?)
            `;
            let param = [req.body.id_meta_copy, req.body.id_meta_paste];
            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)
        },

        /**
         * @param req {Request}
         * @param res {Response}
         */
        remove: async (req, res) => {

            // language=SQL
            const sql = `
                UPDATE DASH_META_VENDA
                SET STATUS_ATIVO = 0
                WHERE (ID = ?);
            `;

            let param = [req.body.id_meta];
            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)
        }

    },

    vendedor: {
        list: async (req, res) => {

            let tb = 'DASH_VW_META_VENDEDOR';
            // language = SQL
            let sql = `
                SELECT *
                FROM ${tb}
                WHERE ID_META = ?
            `;

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, [req.body.id_meta])
        }

    },

    item: {

        list: async (req, res) => {

            let tb = 'DASH_VW_META_ITEM';
            // language = SQL
            let sql = `
                SELECT *
                FROM ${tb}
                WHERE (ID_META = ? and ID_VENDEDOR = ?)
            `;
            let param = [req.body.id_meta, req.body.id_vendedor];

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, param)
        },

        add: async (req, res) => {
            // language = SQL
            let sql = `
                INSERT INTO DASH_META_VENDA_ITEM (ID_META, ID_USER, ID_PRODUTO, QUANTIDADE_META)
                VALUES (?, ?, ?, ?) returning ID;
            `;
            let param = [req.body.id_meta, req.body.id_vendedor, req.body.id_produto, req.body.quantidade];

            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)

        },

        edit: async (req, res) => {
            // language = SQL
            let sql = `
                UPDATE DASH_META_VENDA_ITEM
                SET ID_PRODUTO      = ?,
                    QUANTIDADE_META = ?
                WHERE (ID = ?);
            `;
            let param = [req.body.id_produto, req.body.quantidade, req.body.id_meta_item];

            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)

        },

        remove: async (req, res) => {
            // language = SQL
            let sql = `
                UPDATE DASH_META_VENDA_ITEM
                SET STATUS_ATIVO = 0
                WHERE (ID = ?);
            `;
            let param = [req.body.id_meta_item];

            query.basicQuery(getOptions(req.headers.ambiente), sql, param, res)

        }

    },

    total: {
        list: async (req, res) => {

            let tb = 'DASH_VW_META_ITEM_TOTAL';
            // language = SQL
            let sql = `
                SELECT *
                FROM ${tb}
                WHERE (ID_META = ?)
            `;
            let param = [req.body.id_meta];

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, param)
        },


        listVendedor: async (req, res) => {


            let tb = 'DASH_VW_META_ITEM_VENDEDOR';
            // language = SQL
            let sql = `
                SELECT *
                FROM ${tb}
                WHERE (ID_META = ? and ID_PRODUTO = ?)
            `;
            let param = [req.body.id_meta, req.body.id_produto];

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, param)
        },

    }

}



