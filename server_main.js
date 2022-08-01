
const serverEngine = require('./src/managers/server_engine')

serverEngine.start(false, 'portaOut',
    (app) => {

        app.get('view/servidores', (req, res) => {

        });

    }, () => {
        console.log('Main Server')
    });