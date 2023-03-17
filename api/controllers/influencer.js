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

exports.deleteInfluencer = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({
    id_influencer: req.body.id_influencer,
  })

  Influencer.deleteInfluencer(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}

exports.updateInfluencer = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({
    influencer_data: req.body.profile,
  })

  Influencer.updateInfluencer(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}

exports.getLuoghi = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({})

  Influencer.getLuoghi(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}

exports.getTag = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({})

  Influencer.getTag(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}

exports.createTag = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Influencer({
    tag: req.body.tag,
  })

  Influencer.createTag(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}
