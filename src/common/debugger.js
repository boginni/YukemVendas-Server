module.exports = {

    /**
     *
     * @param req {Request}
     * @param res {Response}
     * @param next
     */
    checkRequest: function (req, res, next) {
        console.log(req.headers)
        console.log(req.body)
        next()
    }

}