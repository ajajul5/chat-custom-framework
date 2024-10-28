const { Sequelize } = require('sequelize')

const sequelize = new Sequelize('db_chat', null, null, {
    // host: process.env.DB_HOST,
    replication: {
        read: [
          { host: 'localhost', username: 'ajajul', password: '123456' }
        ],
        write: { host: 'localhost', username: 'ajajul', password: '123456' }
    },
    dialect: 'mysql',
    port: '3306',
    logging: false, // Set to console.log to see the raw SQL queries
})

module.exports = sequelize