module.exports = {

    /**
     * @return string
     * @param res Response
     */
    invalido_credencial: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 101}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_ambiente: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 102}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_senha: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 103}))
    },

    /**
     * @return {{error: number} | null}
     * @param res Response
     */
    invalido_tabela: (res) => {

        if(res == null){
            return {'error': 104};
        }

        res.status(400);
        res.send(JSON.stringify({'error': 104}))
    },


    /**
     * @return string
     * @param res Response
     */
    invalido_body: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 105}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_user: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 106}))
    },

    /**
     * @return string
     * @param res Response
     */
    erro_interno_query: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 201}))
    },

    /**
     * @return string
     * @param res Response
     */
    erro_interno_fb: (res) => {
        res.status(400);
        res.send(JSON.stringify({'error': 202}))
    },

    /**
     * @return string
     * @param res Response
     */
    acesso_negado: (res) => {
        res.sendStatus(403);
        res.end();
    },

}