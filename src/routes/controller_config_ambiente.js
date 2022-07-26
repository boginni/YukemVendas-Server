const daoConfig = require('../dao/dashboard/dao_config_ambiente');

module.exports = {
    /**
     * @param app {Express}
     */
    register: (app) => {

        app.post('/config/', (req, res) => {

                // TODO: Validar usuário


                let request = {
                    'ambiente': req.headers.ambiente,
                    'valor': req.body.valor,
                    'id': req.body.id
                }


                daoConfig.update(request, res)


            }
        )

    }

}