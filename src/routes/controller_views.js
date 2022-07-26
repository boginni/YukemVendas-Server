const daoView = require('../dao/output/dao_view');
const errors = require('../common/error');
const fs = require('fs')


module.exports = {

    /**
     * @param app {Express}
     */
    register: (app) => {

        // app.post('/view/info', async (req, res) => {
        //     /**
        //      *
        //      * @type {ViewRequest}
        //      */
        //     let viewRequest = {};
        //
        //     viewRequest.ambiente = req.headers.ambiente;
        //     viewRequest.tb = req.body.tb;
        //     viewRequest.data = req.body.data;
        //
        //     if (normalViews[viewRequest.tb]) {
        //         // if (!validateBody(viewRequest)) {
        //         //     errors.invalido_body(res);
        //         //     return;
        //         // }
        //
        //         // daoView.info(viewRequest, res);
        //     } else {
        //         errors.invalido_tabela(res);
        //     }
        //
        // });

        app.post('/view/ping', async (req, res) => {
            res.end('ok');
        });

        app.post('/view/buffed', daoView.getViewContent);

    }

}








