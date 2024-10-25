const express = require('express')
const apiRouter = express.Router()
const v1Routes = require('./api/v1')
const v2Routes = require('./api/v2')
// Use versioned routes
apiRouter.use('/v1', v1Routes)
apiRouter.use('/v2', v2Routes)

module.exports = apiRouter