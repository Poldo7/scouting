const sql = require("../database/index.js")
var bcrypt = require("bcryptjs")

// constructor
const Account = function (params) {
  this.id_account = params.id_account
  this.nome_utente = params.nome_utente
  this.token = params.token
}

Account.login = (data, result) => {
  console.log(data)
  sql.query(
    "SELECT id_account, nome_utente, password FROM account WHERE nome_utente = ?",
    [data.nome_utente],
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, "err")
      } else {
        //console.log(res)
        if (res.length) {
          result(null, res[0])
        } else {
          result(null, null)
        }
      }
    }
  )
}

Account.verifyToken = (data, result) => {
  if (data.id_account === null) return result(null, null)
  //console.log(data)
  sql.query(
    "SELECT id_account, token FROM account WHERE account.id_account = ?",
    [data.id_account],
    (err, res) => {
      if (err) {
        console.log(err)
        result(err, "err")
      } else {
        if (
          res.length &&
          res[0].token !== null
        ) {
          if (bcrypt.compareSync(res[0].token, data.token) === true) {
            result(null, res[0])
          } else result(null, null)
        } else {
          result(null, null)
        }
      }
    }
  )
}

Account.storeToken = (data, result) => {
  //console.log(data)
  sql.query("UPDATE account SET token = ? WHERE id_account = ?", [data.token, data.id_account], (err, res) => {
    if (err) {
      console.log(err)
      result(err, "err")
    } else {
      //console.log(res)
      if (res.affectedRows) {
        result(null, "ok")
      } else {
        result(null, null)
      }
    }
  })
}

module.exports = Account
