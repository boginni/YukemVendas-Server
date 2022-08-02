const fs = require("fs");
const confFile = require('../objects/config_file')

/**
 * @type ServerConfig
 */
var configFile = {};


const serverDir = [
    "./config",
    "./image",
    "./database_update",
    "./ambientes"
]


function getServerConfig() {
    return configFile;
}

function setServerConfig(variable) {
    configFile = variable;
}

module.exports = {

    /**
     * @param ambiente {string}
     * @return {FirebirdConfig}
     */
    getOptions: (ambiente) => {
        return getServerConfig().ambientes[ambiente]
    },

    getServerConfig: () => {
        return getServerConfig()
    },

    /**
     * @param ambienteConfigs {ServerConfig}
     */
    setOptions: (ambienteConfigs, print = false) => {

        let ambientes = ambienteConfigs.ambientes

        let configs = {};

        for (const ambiente of ambientes) {

            let options = {};
            options.host = ambiente.firebird_host;
            options.port = ambiente.firebird_port;
            options.database = ambiente.caminho;
            options.user = 'LIVE';
            options.password = 'MasterLIVE';

            // options.user = 'SYSDBA';
            // options.password = 'masterkey';

            options.lowercase_keys = false; // set to true to lowercase keys
            options.role = null;            // default
            options.pageSize = 4096;        // default when creating database
            options.retryConnectionInterval = 1000;

            options.charset = 'WIN1252';

            options.caixaAlta = ambiente.caixaAlta;
            options.realTimeSync = ambiente.realTimeSync;

            if (print) {
                console.log(`${ambiente.nome} Registrado`);
            }

            configs[ambiente.nome] = options;
        }

        ambienteConfigs.ambientes = configs;

        setServerConfig(ambienteConfigs)
    },


    validateServer: () => {
        for (const dir of serverDir) {
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir);
            }
        }

    },

    createFile: () => {

        let file = new confFile.configFile();
        file.ambientes.push(new confFile.firebirdConfig())

        fs.writeFile('./config/config.json', JSON.stringify(file, null, 4), function (err) {
            if (err) throw err;
            console.log('Criado Arquivo de configuração');
        });
    },

    /**
     *
     * @return {string[]}
     */
    getAmbientes: () => {
        let list = [];

        for (let ambiente in configFile.ambientes) {
            list.push(ambiente);
        }

        return list;
    },


}









