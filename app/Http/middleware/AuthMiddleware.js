const AuthService = require('../../Services/AuthService')
const { AppLogHelper } = require('../../../config/helpers')
const ResponseCodeMixin = require("../../Services/Mixin/ResponseCodeMixin")

/**
 * This middleware checks only for tokens
 * @middleware authMiddleware
 * @authorization Bearer token
 * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
 */
const authMiddleware = async (req, res, next) => {
  if(!req.headers.authorization) {
    let result = ResponseCodeMixin.getResponseCode('103')
    http_code = result['http_code']
    delete result['http_code']
    result.response_code = http_code
    result.message = 'Token is missing'
    res.status(http_code).json(result)
  }

  const token = req.headers.authorization.split(' ')[1]
  const decodedToken = await AuthService.verifyToken(token)

  if (decodedToken.success) {
    req.user = decodedToken.userData
    next()
  } else {
    let result = ResponseCodeMixin.getResponseCode('401')
    result.request_id = AppLogHelper.getRequestId()
    http_code = result['http_code']
    delete result['http_code']
    result.message = decodedToken.message
    return res.status(http_code).json(result)
  }
}

module.exports = authMiddleware
