let Firebird = require("node-firebird");

let options = {};

options.host = 'localhost';
options.port = '3050';
options.database = "N:\\Comtec\\Yukem Vendas\\database\\ALTOGIRO.FDB";
options.user = 'LIVE';
options.password = 'MasterLIVE';
options.lowercase_keys = false; // set to true to lowercase keys
options.role = null;            // default
options.pageSize = 4096;        // default when creating database
options.retryConnectionInterval = 1000;


Firebird.attach(options, function (err, db) {

    if (err) {
        console.log(err)
        return;
    }

    db.query('select * from DASH_VW_META_VENDA_VENDEDOR', [], (err, result) => {
        db.detach();

        if (err) {
            console.log(err)
        }
        console.log(result);
    })

});