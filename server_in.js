const express = require('express');
const cookieParser = require("cookie-parser");
const config = require('./src/managers/server_controller');
const bodyParser = require('body-parser');
const http = require('http');
const app = express();
const fs = require("fs");
const queue = require('express-queue');
const cors = require("cors");

app.use(cors());
app.use(queue({activeLimit: 1, queuedLimit: -1}));

const {formatWithOptions} = require('util');

app.use(express.json());
app.use(cookieParser());

app.use(function errorHandler(err, req, res, next) {
    res.status(400)
    res.send('error ' + err.message);
});


/*
 * REGRISTRA OS LISTENERS
 */
const userManager = require('./src/managers/user_manager');

/*
 *  REGISTRA AS ROTAS
 */
const cliente = require('./src/routes/controller_cliente');
const venda = require('./src/routes/controller_venda');
const utility = require("./src/routes/controller_utility");
const images = require('./src/routes/controller_image');
const daoConfig = require('./src/routes/controller_config_ambiente');
const visita = require('./src/routes/controller_visita')


cliente.register(app)
venda.register(app);
utility.register(app);
images.register(app);
daoConfig.register(app);
visita.register(app);


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
    const port = configFile.portaIn;

    config.setOptions(configFile);

    // app.port = port;
    // app.hostname = hostname;

    let server = http.createServer(app);

    server.listen(port, hostname,
        () => {
            console.log('Running Input Server');
            console.log('host: ' + hostname);
            console.log('port: ' + port);
        }
    );

});
