var dbConfig = {
  HOST: "",
  USER: "",
  PASSWORD: "",
  DB: "",
  PORT: "",
}
if (process.env.NODE_ENV == "production") {
  dbConfig.HOST = process.env.RDS_HOSTNAME
  dbConfig.USER = process.env.RDS_USERNAME
  dbConfig.PASSWORD = process.env.RDS_PASSWORD
  dbConfig.PORT = process.env.RDS_PORT
  dbConfig.DB = "scouting-db"
} else {
  dbConfig.HOST = "localhost"
  dbConfig.USER = "root"
  dbConfig.PASSWORD = "root"
  dbConfig.DB = "scouting"
}

module.exports = dbConfig

/* to connect with external sw
Access Credentials
Username:	b82e1c7a506bf5
Password:	2289f02c (Reset)
*/
