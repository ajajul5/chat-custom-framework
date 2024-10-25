require('dotenv').config()
module.exports = {
    appName : process.env.APP_NAME || 'Express App',
    appEnv :  process.env.APP_ENV || 'testing',
    tokenSecret : process.env.TOKEN_SECRET,
    appUrl : process.env.APP_URL || 'http://localhost',
    appPort : process.env.APP_PORT || 3000,
    timeZone : process.env.APP_TIMEZONE || 'Asia/Kolkata',
    bugsnagApiKey : process.env.BUGSNAG_API_KEY,
}