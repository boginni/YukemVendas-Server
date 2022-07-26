module.exports = {

    /**
     * @return string
     * @param res Response
     */
    invalido_credencial: (res) => {
        return res.status(400).end(JSON.stringify({'error': 101}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_ambiente: (res) => {
        return res.status(400).end(JSON.stringify({'error': 102}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_senha: (res) => {
        return res.status(400).end(JSON.stringify({'error': 103}))
    },

    /**
     * @return {{error: number} | null}
     * @param res Response
     */
    invalido_tabela: (res) => {
        if (res == null) {
            return {'error': 104};
        }

        return res.status(400).end(JSON.stringify({'error': 104}))
    },


    /**
     * @return string
     * @param res Response
     */
    invalido_body: (res) => {
        return res.status(400).end(JSON.stringify({'error': 105}))
    },

    /**
     * @return string
     * @param res Response
     */
    invalido_user: (res) => {
        return res.status(400).end(JSON.stringify({'error': 106}))
    },

    /**
     * @return string
     * @param res Response
     */
    erro_interno_query: (res) => {
        return res.status(400).end(JSON.stringify({'error': 201}))
    },

    /**
     * @return string
     * @param res Response
     */
    erro_interno_fb: (res) => {
        return res.status(400).end(JSON.stringify({'error': 202}))
    },

    /**
     * @return string
     * @param res Response
     */
    acesso_negado: (res) => {
        return res.status(403).end();
    },

}