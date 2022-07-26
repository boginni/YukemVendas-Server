const errors = require('../common/error');
const dao_utility = require('../common/utility');


module.exports = {
    // @app Express
    register: (app) => {
        app.get('/util/data', (req,res) => {
            res.send(dao_utility.timeUtility.getTimeStamp());
        });
    }

}


