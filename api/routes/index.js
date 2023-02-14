var express = require('express');
var router = express.Router();
const controller = require("../controllers/index.js")

/* GET home page. */
router.get('/testAPI', controller.testAPI);

module.exports = router;