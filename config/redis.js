const { createClient } = require('redis');

let pubClient;
let subClient;

(async () => {
    // Create Redis clients
    pubClient = createClient({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
        db: process.env.REDIS_DB
    });
    subClient = pubClient.duplicate(); // Create duplicate client for subscription

    // Add error listeners
    pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err));
    subClient.on('error', (err) => console.error('Redis Sub Client Error:', err));

    // Connect clients
    await Promise.all([
        pubClient.connect(),
        subClient.connect(),
    ]);

    console.log('Redis clients connected');
})();

module.exports = {
    getPubClient: () => pubClient,
    getSubClient: () => subClient,
}

// require('dotenv').config()
// module.exports = {
//     host : process.env.APP_NAME || 'Express App',
//     appEnv :  process.env.APP_ENV || 'testing',
//     tokenSecret : process.env.TOKEN_SECRET,
//     appUrl : process.env.APP_URL || 'http://localhost',
//     appPort : process.env.APP_PORT || 3000,
//     timeZone : process.env.APP_TIMEZONE || 'Asia/Kolkata',


//     const sequelize = new Sequelize(process.env.DB_DATABASE, process.env.DB_USERNAME, process.env.DB_PASSWORD, {
//         host: process.env.DB_HOST,
//         dialect: process.env.DB_CONNECTION,
//         port: process.env.DB_PORT,
//         logging: false, // Set to console.log to see the raw SQL queries
//     })
    
//     module.exports = sequelize
// }