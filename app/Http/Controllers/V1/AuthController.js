const BaseController = require('./../BaseController')
const { UtilHelper } = require('../../../../config/helpers')
const { responseCodeMixin } = require('./../../../../config/mixins')
const AuthService = require('../../../Services/AuthService')
const RoomUserService = require('./../../../Services/RoomUserService')

class AuthController extends BaseController {

    /**
     * Generates a token with a specified duration the default is 3 hours.
     * 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    create = async (req, res) => {
        const body = req.body

        const requireField = await AuthService.getRules()
        const validationErrors = await UtilHelper.validateFields(body, requireField)

        if (validationErrors.length > 0) {
            let result = responseCodeMixin.getResponseCode('101')
            result.data = validationErrors
            return this.response(result,res)
        }

        const response = await RoomUserService.createRoomUser(body)
        if(!response.success) {
            return this.response(response,res)
        }

        const roomReferenceNumber = response.data.room_user.room_reference_number
        const roomUserReferenceNumber = response.data.room_user.room_user_reference_number
        const userRevoked = response.data.room_user.user_revoked
        const payload = {...body, roomReferenceNumber, roomUserReferenceNumber, userRevoked}
        const token = await AuthService.generateToken(payload)
        let result = responseCodeMixin.getResponseCode('1')
        result.data = token
        return this.response(result,res)
    }
}

module.exports = new AuthController()
