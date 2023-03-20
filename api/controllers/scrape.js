const Scrape = require("../models/scrape.js")

exports.scrapeIG = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Scrape({
    profileList: req.body.profileList,
  })

  Scrape.scrapeIG(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}
