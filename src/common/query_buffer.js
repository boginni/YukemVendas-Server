const Firebird = require("node-firebird");
const errors = require("./error");
const e = require("express");


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
    simple: (options, tbName, sql, connErr, callback, ...param) => {


        let sqlColumn = `select rdb$field_name
                         from rdb$relation_fields
                         where rdb$relation_name = ?
                         ORDER BY RDB$FIELD_POSITION;`


        if (param === undefined) {
            param = [];
        }


        Firebird.attach(options, function (err, db) {

            if (err) {
                connErr(err);
                return;
            }

            db.query(sqlColumn, [tbName], (tbErr, result) => {


                let resultSet = {'columns': [], 'rows': []};

                if (tbErr) {
                    callback(tbErr, resultSet);
                    db.detach();
                    return;
                }

                for (const item of result) {
                    resultSet['columns'].push(item['RDB$FIELD_NAME'].trim());
                }


                db.sequentially(sql, param, (row, index) => {
                    resultSet['rows'].push(row);
                }, sqlErr => {

                    callback(sqlErr, resultSet);
                    db.detach();
                }, true)
            })

        });


    },

    simple2: (db, tbName, sql, connErr, callback, ...param) => {

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
}
