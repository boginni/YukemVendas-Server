const Firebird = require("node-firebird");
const errors = require("./error");
const e = require("express");
const firebird = require("node-firebird");


function buffedQueryOptions(options, tbName, sql, connErr, callback, param) {

    if (param === undefined) {
        param = [];
    }

    Firebird.attach(options, function (err, db) {

        if (err) {
            connErr(err);
            return;
        }

        buffedQuery(db, tbName, sql, callback, param)
    });


}

/**
 *
 * @param options {FirebirdConfig}
 * @param tbName {string}
 * @param sql {string}
 * @param callback {function(sqlErr, resultSet )}
 * @param param
 * @return {void}
 */
function buffedQuery(db, tbName, sql, callback, param) {


    // language=SQL format=false
    let sqlColumn = `select rdb$field_name
                     from rdb$relation_fields
                     where rdb$relation_name = ?
                     ORDER BY RDB$FIELD_POSITION;`


    if (param === undefined) {
        param = [];
    }

    db.query(sqlColumn, [tbName], (tbErr, result) => {
        let resultSet = {'columns': [], 'rows': []};

        if (tbErr) {
            callback(tbErr, resultSet);
            return;
        }

        for (const item of result) {
            resultSet['columns'].push(item['RDB$FIELD_NAME'].trim());
        }

        db.sequentially(sql, param, (row, index) => {
            resultSet['rows'].push(row);
        }, sqlErr => {

            callback(sqlErr, resultSet);
        }, true)
    });


}


module.exports = {
    /**
     *
     * @param options {FirebirdConfig}
     * @param tbName {string}
     * @param sql {string}
     * @param connErr {function(connErr)}
     * @param callback {function(sqlErr, resultSet )}
     * @param param
     * @return {void}
     */
    simple: buffedQueryOptions,

    withConn: buffedQuery,

    basicQuery: function (options, sql, param, res) {

        firebird.attach(options, async (err, db) => {

            if (err) {
                res.status(500).end();
                db.detach();
            }

            db.query(sql, param, (err1, result) => {

                if (err1) {
                    res.status(500).end();
                    db.detach();
                    console.log(err1)
                    return;
                }

                res.status(200).end()

                db.detach();


            })


        })


    },

    fast: (res, options, tbName, sql, param) => {


        buffedQueryOptions(options, tbName, sql, err => {
                errors.erro_interno_fb(res);
            }, (err, resultSet) => {
                if (err) {
                    console.log(err);
                    errors.erro_interno_fb(res);
                    return;
                }
                res.status(200).send(resultSet);
            },
            param
        );


    }

}
