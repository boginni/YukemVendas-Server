let fs = require("fs");
let config = require("./src/managers/server_controller");
const Firebird = require("node-firebird");
const sharp = require("sharp");


let data = fs.readFileSync('./config/config.json', 'utf8');
let configFile = JSON.parse(data);
config.setOptions(configFile);


for (const ambiente of config.getAmbientes()) {
    let options = config.getOptions(ambiente)
    Firebird.attach(options, async function (err, db) {

        db.query('select * from cp_produto_foto;', [], async (err1, result) => {

            let filePath = `image/${ambiente}/`;

            console.log(`salvando ${result.length} imagens de ${ambiente}`)

            if (!fs.existsSync(filePath)) {
                fs.mkdirSync(filePath, {recursive: true});
            }

            for (const row of result) {

                await new Promise(resolve => {
                    row['FOTO'](function (err, name, e) {

                        if (err)
                            throw err;

                        let data = [];

                        e.on('data', function (chunk) {
                            data.push(...chunk);
                        });

                        e.on('end', function () {

                            sharp(Buffer.from(data)).toFile(`${filePath}${row['ID_PRODUTO']}-${row['ITEM']}.png`).then((_) => {
                                    resolve();
                                }
                            )


                        });

                    });
                })

            }

            db.detach();

        })

    });
}

