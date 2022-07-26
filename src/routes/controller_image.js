const errors = require('../common/error');
const dao_imagens = require('../dao/output/dao_imagens');
const upload = dao_imagens.multer.single('image')

const fs = require("fs");
const express = require("express");

module.exports = {
    // @app Express
    register: (app) => {

        // app.get('/image/*', (req, res) => {
        //     dao_imagens.getImagens(req.url, res);
        // })

        app.post('/upload/', async (req, res) => {

            upload(req, res, function (err) {

                if (err != null) {

                    let errType = err.message;

                    let response = err;

                    if (errType === 'Unexpected field') {
                        response = 'Campo de arquivo inválido';
                    }


                    return res.status(400).json({
                        erro: true, mensagem: response
                    })

                }

                let amb = req.headers['ambiente'];
                let id = req.headers['id_produto'];

                let dir = './image/' + amb + '/' + id;

                dao_imagens.createIcon(dir)

                res.status(400).json({
                    erro: false,
                    mensagem: 'Upload realizado com sucesso!'
                });


            })


        })

        app.use('/image', express.static('image'));

    }

}