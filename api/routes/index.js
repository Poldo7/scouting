var express = require("express")
var router = express.Router()
const account = require("../controllers/account.js")
const influencer = require("../controllers/influencer.js")
const scrape = require("../controllers/scrape.js")

//** ACCOUNT */
router.post("/login", account.login)
router.post("/storeToken", account.storeToken)
router.post("/verifyToken", account.verifyToken)

//** INFLUENCER */
router.post("/getInfluencers", influencer.getInfluencers)
router.post("/updateInfluencer", influencer.updateInfluencer)
router.post("/deleteInfluencer", influencer.deleteInfluencer)
router.post("/getLuoghi", influencer.getLuoghi)
router.post("/getTag", influencer.getTag)
router.post("/createTag", influencer.createTag)

//** SCRAPE */
router.post("/scrapeIG", scrape.scrapeIG)
//router.post("/scrapeYT", scrape.scrapeYT)

module.exports = router
