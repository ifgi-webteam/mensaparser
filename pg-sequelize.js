var Sequelize = require('sequelize')
  , sequelize = new Sequelize('docker', 'postgres', 'mysecretpassword', {
      dialect: "postgres", // or 'sqlite', 'postgres', 'mariadb'
      host: "172.17.0.6",
      port: 5432, // or 5432 (for postgres)
    })
 
sequelize
  .authenticate()
  .complete(function(err) {
    if (!!err) {
      console.log('Unable to connect to the database:', err)
    } else {
      console.log('Connection has been established successfully.')
    }
  })