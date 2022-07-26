const express = require('express');
const cookieParser = require("cookie-parser");
const http = require('http');
const fs = require("fs");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.static('image'));

app.use(function errorHandler(err, req, res, next) {
    res.status(400)
    res.send('error ' + err.message);
});

const historico = require('./src/routes/controller_historico_pedido');
const user = require('./src/routes/controller_user');
const views = require('./src/routes/controller_views');
const utility = require("./src/routes/controller_utility");

historico.register(app);
user.register(app);
views.register(app);
utility.register(app);


const config = require('./src/managers/server_controller');
const cache = require('./src/managers/cache_manager');
const userManager = require('./src/managers/user_manager');
const event = require('./src/events/EventListener');

config.validateServer();

fs.readFile('./config/config.json', 'utf8', function (err, data) {

    if (err) {
        config.createFile();
        return;
    }

    let configFile = JSON.parse(data);

    const hostname = configFile.servidor;
    const port = configFile.portaOut;

    config.setOptions(configFile);

    let server = http.createServer(app);
    userManager.initIWebsocketServer(server);

    event.startListeners();
    cache.updateCache();


    server.listen(port, hostname,
        () => {
            console.log('Running output Server');
            console.log('host: ' + hostname);
            console.log('port: ' + port);
        }
    );

});
