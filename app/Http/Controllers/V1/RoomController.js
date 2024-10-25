const BaseController = require('./../BaseController')
const RoomService = require('./../../../Services/RoomService')
const { UtilHelper, AppLogHelper } = require('../../../../config/helpers')
const { responseCodeMixin } = require('./../../../../config/mixins')
const RoomResource = require('../../Resources/RoomResource')

class RoomController extends BaseController {
    /**
     * Listing class details
     * 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    index = async (req, res) => {        
        let result = responseCodeMixin.getResponseCode('1')
        const list = await RoomResource.collection(await RoomService.getAll(req.query))
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
        const validationErrors = await UtilHelper.validateFields(req.params, ['roomReferenceNumber'])
        if (validationErrors.length > 0) {
            const result = responseCodeMixin.getResponseCode('101')
            result.data = validationErrors
            return this.response(result,res)
        }
        const roomReferenceNumber = req.params.roomReferenceNumber;
        
        let result = responseCodeMixin.getResponseCode('1')
        const room = await RoomService.fetchRoom(roomReferenceNumber.toUpperCase())
        if(room) {
            result.data = await new RoomResource(room);
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
        const body = req.body
        const requireField = await RoomService.getRules()
        const validationErrors = await UtilHelper.validateFields(body, requireField)

        if (validationErrors.length > 0) {
            const result = responseCodeMixin.getResponseCode('101')
            result.data = validationErrors
            return this.response(result,res)
        }

        const room = await RoomService.createRoom(req.body)
        let result = responseCodeMixin.getResponseCode('1')
        if(room) {
            result.data = await new RoomResource(room);
        } else {
            result = responseCodeMixin.getResponseCode('500')
        }
        return this.response(result,res)
    }

    /**
     * deleting a class
     *
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    destroy = async (req, res) => {
        const validationErrors = await UtilHelper.validateFields(req.params, ['roomReferenceNumber'])
        if (validationErrors.length > 0) {
            const result = responseCodeMixin.getResponseCode('101')
            result.data = validationErrors
            return this.response(result,res)
        }
        const roomReferenceNumber = req.params.roomReferenceNumber;
        const room = await RoomService.deleteRoom(roomReferenceNumber)
        let result = responseCodeMixin.getResponseCode('1')
        if(room) {
            result.data = await new RoomResource(room);
        } else {
            result = responseCodeMixin.getResponseCode('104')
        }
        return this.response(result,res)
    }
}

module.exports = new RoomController()
