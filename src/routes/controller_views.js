const daoView = require('../dao/output/dao_view');
const errors = require('../common/error');
const fs = require('fs')
const seguranca = require("../middleware/seguranca");

const express = require("express")
const router = express.Router();


router.post('/ping', (req, res) => {
    res.send('1').end();
})


router.post('/buffed', seguranca.checkDevice, daoView.getViewContent)


module.exports = router;





