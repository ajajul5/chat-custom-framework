const { AppLogHelper } = require("../../../config/helpers")
const { responseCodeMixin } = require("../../../config/mixins")

/**
 * This middleware checks x-request-id is coming in headers
 * @middleware ApiMiddleware
 * @header x-request-id
 * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
 */
const ApiMiddleware =  (req, res, next) => {
  if(!req.headers.hasOwnProperty('x-request-id') || !req.headers['x-request-id']) {
    let result = responseCodeMixin.getResponseCode('103')
    res.status(result.http_code).json(result)
  } else {
    AppLogHelper.setRequestId(req.headers['x-request-id'])
    next()
  }
}

module.exports = ApiMiddleware
