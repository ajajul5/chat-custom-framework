const { Sequelize } = require('sequelize')

const sequelize = new Sequelize(process.env.DB_DATABASE, null, null, {
    // host: process.env.DB_HOST,
    replication: {
        read: [
          { host: process.env.DB_READ_HOST, username: process.env.DB_READ_USERNAME, password: process.env.DB_READ_PASSWORD }
        ],
        write: { host: process.env.DB_WRITE_HOST, username: process.env.DB_WRITE_USERNAME, password: process.env.DB_WRITE_PASSWORD }
    },
    dialect: process.env.DB_CONNECTION,
    port: process.env.DB_PORT,
    logging: false, // Set to console.log to see the raw SQL queries
})

module.exports = sequelize