const Model = require("../models/index.js")

exports.testAPI = (req, res) => {
  // Validate request
  if (!req.body) {
    res.status(400).send({
      message: "Content can not be empty!",
    })
  }

  const params = new Model({
    //id: req.body.id,
  })

  Model.testAPI(params, (err, data) => {
    if (err)
      res.status(500).send({
        message: err.message || "Some error occurred.",
      })
    else res.send(data)
  })
}