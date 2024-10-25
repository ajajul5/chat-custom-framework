const express        = require('express')
const apiRouter      = express.Router()
const path           = require('path')
const TestV2Controller = require('./../../app/Http/Controllers/V2/TestV2Controller')

// Define routes for v2

apiRouter.post('/test', TestV2Controller.index)

module.exports = apiRouter