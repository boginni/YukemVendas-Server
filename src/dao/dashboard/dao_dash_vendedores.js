const errors = require('../../common/error');
const query = require('../../common/query_buffer');

module.exports = {

    selectData: (req, res, options) => {
        res.status(200);

        query.simple(options, tbName, sql,
            err => {
                errors.erro_interno_fb(res);
                return;
            },
            (err, resultSet) => {
                if (err) {
                    console.log(err);
                    errors.erro_interno_fb(res);
                    return;
                }
                res.send(resultSet);
            }
        )
    }

}

const tbName = 'DASH_VW_VENDEDOR';
// language=SQL format=false
const sql = `SELECT * FROM ${tbName};`;


