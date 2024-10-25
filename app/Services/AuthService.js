const jwt = require('jsonwebtoken')
const moment = require('moment')
const {timeZone, tokenSecret} = require('../../config/app')
class AuthService {
    /**
     * Arrays of all required fields
     *
     * @returns {Array} - An object containing required fields
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    getRules = async () => {
        return [
            'attributes.display_name',
            'userReferenceNumber',
            'role',
            'scope',
        ]
    }
    
    /**
     * Generates a token with a specified duration the default is 3 hours.
     *
     * @param {Object} body - The request body containing user information.
     * @returns {Object} - An object containing the token, issued_at, and expiry_at.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    generateToken = async (body) => {
        const duration = body.hasOwnProperty('duration') ? body.duration : 180
        const iat = Math.floor(Date.now() / 1000) // Current time in seconds
        const exp = iat + 60 * duration // Expire in 3 hour
        const payload = {...body, iat, exp}
        return {
            token : jwt.sign(payload , tokenSecret, { algorithm: 'HS256'}),
            tokenIssuedTime : moment.unix(parseInt(iat)).tz(timeZone).format(),
            tokenExpirationTime : moment.unix(parseInt(exp)).tz(timeZone).format(),
        }
    }


    
    /**
     * Token verification and returning what token constains inside.
     *
     * @param {String} token - token containing user information.
     * @returns {Object} - An object containing the token, issued_at, and expiry_at.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    verifyToken = async (token) => {
        let tokenData = {
            success : false,
            message : '',
            userData : {},
        }
        jwt.verify(token, tokenSecret, (err, decoded) => {
            if (err) {
                tokenData.success = false
                tokenData.userData = {}
                if (err.name === 'TokenExpiredError') {
                    tokenData.message = 'Token has expired.'
                } else {
                    tokenData.message = 'Invalid Token'
                }
            } else {             
                tokenData.success = true
                delete decoded.iat
                delete decoded.exp
                delete decoded.duration
                tokenData.userData = decoded
            }
        })

        return tokenData
    }
}

module.exports = new AuthService()