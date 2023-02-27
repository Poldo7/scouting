var express = require("express");
var router = express.Router();
const account = require("../controllers/account.js");
const influencer = require("../controllers/influencer.js");

//** ACCOUNT */
router.post("/login", account.login);
router.post("/storeToken", account.storeToken);
router.post("/verifyToken", account.verifyToken);

//** INFLUENCER */
router.post("/getInfluencers", influencer.getInfluencers);

module.exports = router;
