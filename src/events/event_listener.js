const Firebird = require("node-firebird-dev");
const userManager = require("../managers/user_manager");
const controller = require("../managers/server_controller")
/**
 * @type {Map<string, Map<string, boolean>>}
 */
let events_amb = {};

const events = [
    "MOB_CLIENTE_UPDATE_DLU",
    "MOB_PRODUTO_UPDATE_DLU",
    "MOB_CONF_AMBIENTE_UPDATE",
    "MOB_TABELA_PRECO_UPDATE",
    "MOB_CONTATO_UPDATE",
    "MOB_ROTA_UPDATE",
    "MOB_CP_UPDATE",
    "MOB_FORMA_PAGAMENTO_UPDATE",
    "MOB_COMODATO",
]

module.exports = {

    startListeners: () => {


        let configFile = controller.getServerConfig();

        console.log('Eventos Registrados');

        for (let key in events) {
            console.log(`\t${events[key]}`);
        }

        for (let ambiente in configFile.ambientes) {
            let options = configFile.ambientes[ambiente];

            events_amb[ambiente] = {};

            for (let event in events) {
                events_amb[ambiente][events[event]] = false;
            }

            if(!options.realTimeSync){
                continue;
            }

            console.log(`Ativando RealtimeSync para ${ambiente}`);

            Firebird.attach(options, function (err, db) {

                if(err){
                    console.log(err);
                    throw 'err'
                }

                db.attachEvent(function (err, evtmgr) {
                    if (err)
                        return console.log('Error : ', err);

                    evtmgr.on('post_event', function (name, count) {
                        events_amb[ambiente][name] = true;
                    })


                    evtmgr.registerEvent(events, function (err) {
                        if(err !== null){
                            console.log(`${ambiente}: escutando eventos`)
                        } else {
                            console.log(`Não foi possível inicar eventos para ${ambiente}`);
                        }

                    })

                    // evtmgr.unregisterEvent(["evt1"], function (err) {
                    //     console.log('remove evt1, after that you only receive evt2')
                    // })
                })


            });



        }


        setInterval(function () {



            let map = new Map();

            let toSend = false;

            for (let eventAmbiente in events_amb) {


                let eventList = [];

                for (let eventName in events_amb[eventAmbiente]) {

                    if (events_amb[eventAmbiente][eventName]) {

                        eventList.push(eventName);
                        events_amb[eventAmbiente][eventName] = false;
                    }

                }

                if (eventList.length > 0) {
                    toSend = true;
                    map[eventAmbiente] = eventList;
                }

            }

            if (toSend) {
                let msg = new Map();

                msg.name = 'fbEventList';
                msg.data = map;
                // 'event

                console.log(`eventos atirados: ${JSON.stringify(map)}`);
                userManager.sendData(msg);

            }


        }, 5000);


    }

}