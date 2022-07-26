const config = require("./server_controller");
const fs = require("fs");
const http = require("http");
const userManager = require("./user_manager");
const event = require("../events/EventListener");
const cache = require("./cache_manager");
const express = require("express");

module.exports = {

    /**
     *
     * @param app {Express}
     * @param callback {Function}
     * @param details {boolean}
     */
    start: function (app, details, callback) {

        app.use(express.json());

        app.use(function errorHandler(err, req, res, next) {
            res.status(400)
            res.send('error ' + err.message);
        });

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

            if (details) {
                userManager.initIWebsocketServer(server);
                event.startListeners();
                cache.updateCache();
            }


            server.listen(port, hostname,
                () => {
                    console.log('host: ' + hostname);
                    console.log('port: ' + port);

                    callback();
                }
            );

        });


    }

}