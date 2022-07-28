class ConfigFile {
    servidor = 'localhost';
    porta;
    portaOut = 11002;
    portaIn = 11004;
    portaDash = 11006;
    /**
     * @type FirebirdConfig[]
     */
    ambientes = [];

}

class FirebirdConfig {
    nome = 'ambiente';
    caixaAlta = true;
    realTimeSync = true;
    realTimeDelay = 5000;
    caminho = "";
    firebird_host = "localhost";
    firebird_port = 3050;
}

module.exports = {
    configFile : ConfigFile,
    firebirdConfig : FirebirdConfig
};

