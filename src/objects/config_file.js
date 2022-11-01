class ConfigFile {
    servidor = 'localhost';
    porta = 11002;
    debug = true;
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
    configFile: ConfigFile,
    FirebirdConfig: FirebirdConfig
};

