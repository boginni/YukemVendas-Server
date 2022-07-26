const daoUser = require('../dao/output/dao_login');
const errors = require('../common/error');
const daoIp = require('../common/ip_storage');



module.exports = {

    /**
     * @param app {Express}
     *
     * Rota para Fazer login
     */
    register: (app) => {

        app.post('/login/', async (req, res) => {
            daoUser.login(req, res);
        });
        // app.post('/ip/', async (req, res) =>{
        //
        //     daoIp.getIp(req.headers.idvendedor, res)
        // })
    }

}

