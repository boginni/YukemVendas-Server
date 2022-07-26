const utility = require('../../common/utility');
const multer = require("multer");
const fs = require("fs");

const sharp = require('sharp');


module.exports = {

    /**
     * @param path {string}
     * @param res {Response}
     */
    getImagens: (path, res) => {

        fs.readFile('./' + path, function (err, data) {

            if (err) {
                res.status(404);
                res.end();
                return;
            }

            res.writeHead(200, {'Content-Type': 'image/png'});
            res.end(data);
        })

    },

    createIcon: (path) => {

        let nomeImage = path + '-icon.png';

        // console.log(path)
        // console.log(nomeImage);

        // let generator = gm(path + '.png');


        sharp(path +'.png').resize(128, 128).toFile(nomeImage, (err, resizeImage) => {
            if (err) {
                console.log(`${utility.timeUtility.getLogTime()}  Erro ao criar thumb: ${nomeImage}\n${err}!`);
            } else {
                console.log(`${utility.timeUtility.getLogTime()}  Thumbnail criada! : ${nomeImage}`);
            }
        });

        // generator.thumbnail(100, 100).write(nomeImage, (err) => {
        //     if (err) {
        //         console.log('erro:' + err)
        //     } else {
        //
        //     }
        // })

    },

    multer: multer(
        {
            storage: multer.diskStorage({
                destination: (req, file, cb) => {

                    let amb = req.headers['ambiente'];
                    let dir = './image/' + amb + '/';
                    if (!fs.existsSync(dir)) {
                        //Cria o se não existir
                        fs.mkdirSync(dir);
                    }
                    cb(null, dir);
                },
                filename: (req, file, cb) => {

                    let amb = req.headers['ambiente'];
                    let id = req.headers['id_produto'];


                    cb(null, id + '.png');
                }
            }),
            fileFilter: (req, file, cb) => {


                if (req.headers) {
                    cb
                }

                const extensaoImg = ['image/png'/*, 'image/jpg', 'image/jpeg'*/].find
                (formatoAceito => formatoAceito === file.mimetype);

                if (req.headers.usuario !== 'master') {
                    return cb('usuário inválido', false);
                }

                if (!extensaoImg) {
                    return cb('extenção inválida', false);
                }

                return cb(null, true);


            },
        }
    )

}