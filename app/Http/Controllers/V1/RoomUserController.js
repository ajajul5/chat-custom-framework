const BaseController = require('./../BaseController')
const { responseCodeMixin } = require('./../../../../config/mixins')
const RoomUserResource = require('../../Resources/RoomUserResource')
const RoomUserService = require('../../../Services/RoomUserService')
const { UtilHelper, AppLogHelper } = require('../../../../config/helpers')


class RoomUserController extends BaseController {
    /**
     * Listing class details
     * 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    index = async (req, res) => {        
        let result = responseCodeMixin.getResponseCode('1')
        const list = await RoomUserResource.collection(await RoomUserService.getAll(req.query))
        const totalRecord = await AppLogHelper.getTotalRecordCount();
        result.data['totalRecord'] = totalRecord;
        result.data['list'] = list;
        this.response(result, res)
    }

    /**
     * fetch a class
     *
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    show = async (req, res) => {
        
        const validationErrors = await UtilHelper.validateFields(req.params, ['roomUserReferenceNumber'])
        if (validationErrors.length > 0) {
            const result = responseCodeMixin.getResponseCode('101')
            result.data = validationErrors
            return this.response(result,res)
        }
        const roomUserReferenceNumber = req.params.roomUserReferenceNumber;
        
        let result = responseCodeMixin.getResponseCode('1')
        const room = await RoomUserService.fetchRoom(roomUserReferenceNumber.toUpperCase())
        if(room) {
            result.data = await new RoomUserResource(room);
        } else {
            result = responseCodeMixin.getResponseCode('104')
        }
        return this.response(result,res)
    }

    /**
     * Storing class details
     * 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    create = async (req, res) => {

        // throw new RecordNotFoundException(`User with ID not found`);
        // const body = req.body
        // const requireField = await RoomUserService.getRules()
        // const validationErrors = await UtilHelper.validateFields(body, requireField)

        // if (validationErrors.length > 0) {
        //     const result = responseCodeMixin.getResponseCode('101')
        //     result.data = validationErrors
        //     return this.response(result,res)
        // }
        // console.log('req.body', req.body);
        // const room = await RoomUserService.storeRoomUser(req.body)

        // let result = responseCodeMixin.getResponseCode('1')
        // if(room) {
        //     result.data = await new RoomResource(room);
        // } else {
        //     result = responseCodeMixin.getResponseCode('500')
        // }
        // let result = responseCodeMixin.getResponseCode('1')
        // return this.response(result,res)
    }

    /**
     * deleting a class
     *
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    destroy = async (req, res) => {
        // const validationErrors = await UtilHelper.validateFields(req.params, ['roomReferenceNumber'])
        // if (validationErrors.length > 0) {
        //     const result = responseCodeMixin.getResponseCode('101')
        //     result.data = validationErrors
        //     return this.response(result,res)
        // }
        // const roomReferenceNumber = req.params.roomReferenceNumber;
        // const room = await RoomService.deleteRoom(roomReferenceNumber)
        // let result = responseCodeMixin.getResponseCode('1')
        // if(room) {
        //     result.data = await new RoomResource(room);
        // } else {
        //     result = responseCodeMixin.getResponseCode('104')
        // }
        // return this.response(result,res)
    }
}

module.exports = new RoomUserController()
