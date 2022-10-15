const config = require("./server_controller");
const fs = require("fs");
const http = require("http");
const userManager = require("./user_manager");
const event = require("../events/event_listener");
const cache = require("./cache_manager");
const express = require("express");
const cluster = require("cluster");
// const bodyParser = require('body-parser')
const cors = require("cors");

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

            try {
                console.log(`Number of CPUs is ${totalCPUs}`);
                console.log(`Master ${process.pid} is running`);

                let data = fs.readFileSync('./config/config.json', 'utf8');
                let configFile = JSON.parse(data);
                const hostname = configFile.servidor;
                const port = configFile[serverReference];

                config.setOptions(configFile);
                console.log('host: ' + hostname);
                console.log('port: ' + port);


                let clusters = [];

                for (let i = 0; i < totalCPUs; i++) {

                    let c = cluster.fork();

                    c.on("message", (msg, handle) => {
                        console.log(msg)
                    })

                    clusters.push(c);

                }

                cluster.on("exit", (worker, code, signal) => {
                    console.log(`worker ${worker.process.pid} died`);
                    console.log("Let's fork another worker!");
                    cluster.fork();
                });

                cluster.on("message", (msg, handle) => {
                    console.log(msg)
                });


                for (const c of clusters) {
                    c.emit("message", `i am ${process.pid}`)
                }

                // cluster.emit("message", `i am ${process.pid}`);


                callback();

                let server = http.createServer(app);

                if (details) {
                    userManager.initIWebsocketServer();
                    event.startListeners();
                    cache.updateCache();
                }

            } catch (e) {
                config.validateServer();
                config.createFile();
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

            server.listen(port, hostname,
                () => {

                }
            );


        }


    },

    singleThread: function (details, serverReference, routes, callback) {

        const app = express();

        try {

            let data = fs.readFileSync('./config/config.json', 'utf8');
            let configFile = JSON.parse(data);
            const hostname = configFile.servidor;
            const port = configFile[serverReference];

            config.setOptions(configFile);
            console.log('host: ' + hostname);
            console.log('port: ' + port);

            app.use(express.urlencoded({extended: false}));
            app.use(express.json({limit: '50mb'}));

            app.use(cors());

            // app.use(express.json({limit: '50mb'}));

            // app.use(bodyParser.urlencoded({
            //     extended: true
            // }));

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


        } catch (e) {

            console.log(e)

            config.validateServer();
            config.createFile();
        }


    }

}