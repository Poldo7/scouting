const Influencer = require("../models/influencer.js")

exports.getInfluencers = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({})

  Influencer.getInfluencers(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}