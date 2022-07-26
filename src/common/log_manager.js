const fs = require('fs')
const daoUtility = require('./utility');

/**
 * CONTENT = CONTEÚDO
 * PATH = NOME DO AMBIENTE
 * FLAG A+ CRIA O CAMINHO E O ARQUIVO NO FINAL SE NÃO EXISTIR
 */


function getFile(pasta) {
    return {
        'pasta': `./log/${pasta}`, 'nome': `${daoUtility.timeUtility.getDate()}.txt`
    };
}

function getLog(id, tipo, dados) {
    return {
        'usuario': id,
        'tipo': tipo,
        'horario': daoUtility.timeUtility.getTime(),
        'dados': dados
    };
}

function salvarLog(path, log, print = false) {
    fs.writeFile(path, JSON.stringify(log) + '\n\n', {flag: 'a+'}, (err) => {

        if (err) {
            // getLog(log.usuario, 'erro', err)
            console.log('Erro: ' + err)
            return;
        }
        printLog(log)
    })
}

function printLog(log) {
    let str = `[${daoUtility.timeUtility.getDateTime()}] usuario(${log.usuario}) > ${log.tipo}`;
    let path = fileExists(getFile('server'));
    fs.writeFile(path, str + '\n', {flag: 'a+'}, (err) => {

        if (err) {
            // getLog(log.usuario, 'erro', err)
            console.log('Erro: ' + err)
        }

        console.log(str);
    })
}


function logSaveCliente(content, amb) {
    let path = fileExists(getFile('cliente'));
    let log = getLog(content.idusuario, `Novo cliente [${content.idintegracao}]`, content);
    salvarLog(path, log)
}

function logSaveVenda(content, amb) {
    let path = fileExists(getFile('venda'));
    let log = getLog(content.cab.idvendedor, `Nova venda [${content.cab.idintegracao}] `, content);
    salvarLog(path, log)
}

function fileExists(file) {
    if (!fs.existsSync(file.pasta)) {
        fs.mkdirSync(file.pasta, { recursive: true });
    }

    let path = './'+file.pasta + '/' + file.nome;

    if (!fs.existsSync(path)) {
        fs.writeFileSync(path, '');
    }

    return path;
}

module.exports = {
    logSaveCliente, logSaveVenda
}