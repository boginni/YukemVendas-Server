
const dash = require('../dao/dashboard/dao_dash')
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");

module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {

        const path = require("path");
        const flutter = path.join(__dirname, './public-flutter/');
        console.log(flutter);
        app.use('', cookieParser, cors, express.static('public-flutter'));

        app.post('/dash/vendas/', async (req, res) => {
            dash.getVendedorVendas(req, res);
        });

        app.post('/dash/vendedor/', async (req, res) => {
            dash.getVendedores(req, res);
        });

        app.post('/dash/periodo/vendas/', async (req, res) => {
            dash.getPeriodoVendas(req, res);
        });

    }

}
