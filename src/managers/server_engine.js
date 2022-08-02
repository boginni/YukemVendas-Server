const config = require("./server_controller");
const fs = require("fs");
const http = require("http");
const userManager = require("./user_manager");
const event = require("../events/EventListener");
const cache = require("./cache_manager");
const express = require("express");
const cluster = require("cluster");

const totalCPUs = require("os").cpus().length;


module.exports = {

    /**
     *
     * @param routes {Function}
     * @param callback {Function}
     * @param details {boolean}
     * @param serverReference
     */
    start: function (details, serverReference, routes, callback) {


        const app = express();

        if (cluster.isMaster) {

            console.log(`Number of CPUs is ${totalCPUs}`);
            console.log(`Master ${process.pid} is running`);

            for (let i = 0; i < totalCPUs; i++) {
                cluster.fork();
            }

            cluster.on("exit", (worker, code, signal) => {
                console.log(`worker ${worker.process.pid} died`);
                console.log("Let's fork another worker!");
                cluster.fork();
            });





            let data = fs.readFileSync('./config/config.json', 'utf8');
            let configFile = JSON.parse(data);
            const hostname = configFile.servidor;
            const port = configFile[serverReference];
            config.validateServer();
            config.setOptions(configFile);
            console.log('host: ' + hostname);
            console.log('port: ' + port);



            callback();

            let server = http.createServer(app);

            if (details) {
                userManager.initIWebsocketServer(server);
                event.startListeners();
                cache.updateCache();
            }

        } else {
            console.log(`Worker ${process.pid} started`);

            app.use(express.json({limit: '50mb'}));

            // app.use(express.urlencoded());

            app.use(function errorHandler(err, req, res, next) {
                res.status(400)
                res.send('error ' + err.message);
            });

            routes(app)

            let data = fs.readFileSync('./config/config.json', 'utf8');

            let configFile = JSON.parse(data);
            const hostname = configFile.servidor;
            const port = configFile[serverReference];

            config.setOptions(configFile);

            let server = http.createServer(app);

            if (details) {
                userManager.initIWebsocketServer(server);
            }

            server.listen(port, hostname,
                () => {

                }
            );


        }


    }

}