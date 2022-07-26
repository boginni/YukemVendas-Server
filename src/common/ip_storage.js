const Firebird = require("node-firebird");
const ambiente = require('../managers/server_controller');
const errors = require('./error');
const daoUtility = require('./utility');


const userManager = require('../managers/user_manager');

var crypto = require('crypto');
var input = {}

module.exports = {
    /**
     * @param user {User}
     * @param res {Response}
     */
     saveIp: (user, res) => {
        var options = ambiente.getOptions(user.ambiente);

        // SERVE PARA SABER SE O AMBIENTE É VÁLIDO
        if (options == null) {
            errors.invalido_ambiente(res);
            return null;
        }

        save(user.idVendedor, user.ip)
    
    },
    getIp: (idvendedor, res) =>{
      var line = ''

      for (idvendedor in input){
        line =input[idvendedor].toString()
      }
      if (line != ''){
          console.log('Usuário: '+idvendedor + ' - IP [' + line +']');
          return line
      } else {
          console.log('Não foi feito login com esse usuário! ID (' + idvendedor + ')')
          return
      }
    },
    getMac: (idvendedor, res) =>{
                
    }
}

function save(idVendedor, ip){
    if (input[idVendedor] !== undefined){
        return input[idVendedor].push(ip);
    } else {
        input[idVendedor] = [ip]
    }
}

