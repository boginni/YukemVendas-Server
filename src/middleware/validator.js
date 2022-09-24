const {validationResult} = require("express-validator");
const errors = require("../common/error");
const controller = require("../managers/server_controller");

module.exports = {

    /**
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    validation_form: function (req, res, next) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array({onlyFirstError: true}))
        }

        next();
    },


    validation_ambiente: function (req, res, next) {

        let options = controller.getOptions(req.headers.ambiente);

        if (options == null) {
            return errors.invalido_ambiente(res);
        }

        next();
    }

}