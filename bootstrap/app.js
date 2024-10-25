const express = require('express')
const bugsnag = require('@bugsnag/js')
const bugsnagExpress = require('@bugsnag/plugin-express');
const app = express()
const cors = require('cors');
const fs = require('fs')
const path = require('path')
const bodyParser = require('body-parser')
const envFilePath = path.resolve(__dirname, './../.env')

const { bugsnagApiKey } = require('../config/app')
const { appEnv } = require('../config/app')

// Initialize Bugsnag with your API key
const bugsnagClient = bugsnag.start({
  apiKey: bugsnagApiKey,
  plugins: [bugsnagExpress],
  releaseStage : appEnv
});

// Add the provided middleware to your server:
const bugsnagMiddleware = bugsnagClient.getPlugin('express');
app.use(bugsnagMiddleware.requestHandler);

// Check if .env file exists
if (!fs.existsSync(envFilePath)) {
  console.error(`.env file not found at path: ${envFilePath}`)
  process.exit(1) // Exit the process if .env is missing
}
app.use(cors());
const { appPort } = require('../config/app')
const server = app.listen(appPort, () => console.log(`Chat server on port ${appPort}`))
const io = require('socket.io')(server)

// const io = require('socket.io')(server
//   , {
//   cors: {
//     origin: '*', // Your app's URL
//     methods: ['GET', 'POST']
//   }
//   }
// );

app.use(express.static(path.join(__dirname, '../public')))
app.use(bodyParser.json())       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}))

const routes = require('../routes/api')
const ApiMiddleware = require('../app/Http/middleware/ApiMiddleware')
app.use('/api',ApiMiddleware, routes)
const socketRoutes = require('../routes/socket')(io)

// This must be the last middleware in your Express app
app.use(bugsnagMiddleware.errorHandler);

module.exports = app