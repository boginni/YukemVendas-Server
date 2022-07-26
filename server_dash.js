const express = require('express');
const cookieParser = require("cookie-parser");
const config = require('./src/managers/server_controller');
const http = require('http');
const fs = require("fs");
const cors = require("cors");

const app = express();

// app.use(express.json());
app.use(cookieParser());

app.use(cors());

app.use(function errorHandler(err, req, res, next) {

    console.log('request error')

    // console.log(req.headers)
    // console.log(req.body)

    console.log(err)

    res.status(400)
    res.send('error ' + err.message);
});


const dash = require('./src/routes/controller_dashboard')

dash.register(app);


const path = require("path");
const flutter = path.join(__dirname, './public-flutter/');
console.log(flutter);
app.use(express.static('public-flutter'));


/**
 *  Inicializa o servidor
 */

config.validateServer();

fs.readFile('./config/config.json', 'utf8', function (err, data) {

    if (err) {
        config.createFile();
        return;
    }

    let configFile = JSON.parse(data);

    const hostname = configFile.servidor;
    const port = configFile.portaDash;

    config.setOptions(configFile);

    // app.port = port;
    // app.hostname = hostname;

    let server = http.createServer(app);

    server.listen(port, hostname,
        () => {
            console.log('Running Deashboard Server');
            console.log('host: ' + hostname);
            console.log('port: ' + port);
        }
    );

});
