var dbConfig = {
  HOST: "",
  USER: "",
  PASSWORD: "",
  DB: "",
}
if (process.env.NODE_ENV == "production") {
  dbConfig.HOST = ""
  dbConfig.USER = ""
  dbConfig.PASSWORD = ""
  dbConfig.DB = ""
} else {
  ;(dbConfig.HOST = "localhost"),
    (dbConfig.USER = "root"),
    (dbConfig.PASSWORD = "root"),
    (dbConfig.DB = "scouting")
}

module.exports = dbConfig

/* to connect with external sw
Access Credentials
Username:	b82e1c7a506bf5
Password:	2289f02c (Reset)
*/
