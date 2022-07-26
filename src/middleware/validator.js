const {validationResult} = require("express-validator");

module.exports = {


    /**
     * @param req {Request}
     * @param res {Response}
     * @param next {Function}
     */
    form_validation: function (req, res, next) {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(422).jsonp(errors.array({onlyFirstError: true}))
        }

        next();
    }

}