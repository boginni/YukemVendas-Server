// const Firebird = require("node-firebird");
// const events = require("events");
const WebSocket = require('ws')
const config = require('./server_controller');

/**
 * @type {Map<string, Credencial>}
 */
let users = {};

/**
 *
 * @type { WebSocket[]}
 */
let socketManager = [];

module.exports = {

    /**
     * @param user {Credencial}
     */
    addUser: (user) => {
        console.log(user.user + '(' + user.idVendedor + ') conectado - ' + user.ambiente + ' - ip [' + user.ip + ']');
        users[user.ambiente + user.idVendedor] = user.lastUUID;
    },

    /**
     * @param user {Credencial}
     * @return boolean
     */
    checkUser: (user) => {
        return true
        // return users.get(user.ambiente + user.idVendedor).lastUUID === user.lastUUID;
    },

    /**
     *
     * @param server {Server}
     */
    initIWebsocketServer: (server) => {


        // let ambientes = config.getAmbientes();
        //
        // for (let key in ambientes) {
        //     socketManager[ambientes[key]] = [];
        // }

        let wss = new WebSocket.Server({server: server})
        /**
         * @param socket {WebSocket}
         */
        let event = function (socket) {

            // socketManager.push(socket);

            // socket.on('message', function (msg) {
            //     socketManager.forEach(s => s.send(msg));
            // });

            socket.onmessage = function (msg) {

                try {
                    webEvent(JSON.parse(msg.data), socket)
                } catch (e) {
                    console.log('invalid json');

                    console.log(msg.data);


                }

            }
            socket.on('close', function () {
                socketManager = socketManager.filter(s => s !== socket);
            });

        }


        wss.on('connection', event);


    },

    /**
     *
     * @return {WebSocket[]}
     */
    getSockets: () => {
        return socketManager;
    },

    /**
     *
     * @param msg {JSON}
     */
    sendData: (msg) => {
        let data = JSON.stringify(msg)
        socketManager.forEach(s => s.send(data));
    }

}


/**
 * @param socket {WebSocket}
 * @param msg {JSON}
 */
function webEvent(msg, socket) {

    switch (msg.name) {
        case 'register':
            register(msg, socket)
            break;
        case 'debug':
            console.log(socketManager);
            break;
        default :
            console.log(msg);
            break
    }
}

/**
 * @param socket {WebSocket}
 * @param msg {JSON}
 */
function register(msg, socket) {

    // let ambiente = msg.data.ambiente
    // console.log(ambiente);

    socketManager = socketManager.filter(s => s !== socket);
    socketManager.push(socket);

    // if (socketManager != null) {
    // }

}


// socket.on()
// socket.onmessage((socket, msg) =>{
//     socketManager.forEach(s => s.send(msg));
// })