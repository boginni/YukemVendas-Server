const errors = require('../../common/error');
const query = require('../../common/query_buffer');
const {fast} = require("../../common/query_buffer");

module.exports = {

    selectData: (req, res, options) => {
        fast(res, options, tbName, sql)
    }

}

const tbName = 'DASH_VW_VENDEDOR';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName};`;


