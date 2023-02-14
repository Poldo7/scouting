const sql = require("../database/index.js")

// constructor
const Model = function (params) {
  //this.id = params.id
}

Model.testAPI = (data, result) => {
  result(null, "API is working properly")

  /*var sql_string = ""
  sql_string += ""
  sql.query(sql_string, [data.id_influencer], (err, res) => {
    if (err) {
      console.log(err)
      //store the error
      result(err, null)
    } else {
      //console.log(res)
      if (res.length) {
        result(null, res[0])
      } else {
        result(null, null)
      }
    }
  })*/
}

module.exports = Model
