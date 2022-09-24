const errors = require('../../../common/error');
const query = require('../../../common/query_buffer');
const {getOptions} = require("../../../managers/server_controller");

module.exports = {

    produto: {

        /**
         * @param req {Request}
         * @param res {Response}
         */
        list: async (req, res) => {
            const tb = 'DASH_VW_UTIL_PRODUTO_LIST';
            // language=SQL format=false
            let sql = `SELECT * FROM ${tb} where (1 = 1)`;
            let param = [];

            if (req.body.mobile) {
                // language=SQL format=false
                sql += " and (STATUS_MOBILE = 'T') "
            }

            let filter = req.body.filter;

            if (filter !== '') {

                if (Number.isInteger(parseInt(filter))) {
                    // language=SQL format=false
                    sql += " and (ID_PRODUTO = ?)";
                    param.push(filter);
                } else {
                    // language=SQL format=false
                    sql += " and (NOME_PRODUTO like ?)";
                    param.push(`%${filter.toUpperCase()}%`);
                }

            }

            sql += ';';

            // console.log(sql);
            // console.log(param);

            query.fast(res, getOptions(req.headers.ambiente), tb, sql, param)
        },


    }

}



