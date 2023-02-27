const Account = require("../models/account.js")

exports.login = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Account({
    nome_utente: req.body.nome_utente,
  })

  Account.login(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}


exports.verifyToken = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }
  const params = new Account({
    id_account: req.body.id_account,
    token: req.body.token,
  })

  Account.verifyToken(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}

exports.storeToken = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "I dati non possono essere vuoti",
    })
  }

  const params = new Account({
    id_account: req.body.id_account,
    token: req.body.token,
  })

  Account.storeToken(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Ops! Il server ha smesso di funzionare, riprova più tardi",
      })
    else res.send(data)
  })
}