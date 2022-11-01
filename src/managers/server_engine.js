const config = require("./server_controller");
const fs = require("fs");
const http = require("http");
const userManager = require("./user_manager");
const event = require("../events/event_listener");
const cache = require("./cache_manager");
const express = require("express");
// const bodyParser = require('body-parser')
const cors = require("cors");
const {setDebugMode} = require("./server_controller");


module.exports = {

    singleThread: function (details, serverReference, routes, callback) {

        const app = express();

        let data = null
        config.validateServer();

        try {
            data = fs.readFileSync('./config/config.json', 'utf8');
        } catch (e) {
            console.log(e)
            config.createFile();
        }

        if (data == null) {
            return
        }

        let configFile = JSON.parse(data);
        const hostname = configFile.servidor;
        const port = configFile[serverReference];

        config.setOptions(configFile);

        setDebugMode(configFile.debug);

        console.log('host: ' + hostname);
        console.log('port: ' + port);

        app.use(express.urlencoded({extended: false}));
        app.use(express.json({limit: '50mb'}));

        app.use(cors());

        app.use(function errorHandler(err, req, res, next) {
            res.status(400)
            res.send('error ' + err.message);
        });

        routes(app);

        let server = http.createServer(app);

        if (details) {
            userManager.initIWebsocketServer(server);
            event.startListeners();
            cache.updateCache();
        }

        server.listen(port, hostname,
            () => {
                callback();
            }
        );


    }

}