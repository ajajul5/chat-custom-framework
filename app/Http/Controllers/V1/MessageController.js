const BaseController = require('./../BaseController')
const MessageService = require('./../../../Services/MessageService')
const { UtilHelper, AppLogHelper } = require('../../../../config/helpers')
const { responseCodeMixin } = require('./../../../../config/mixins')
const MessageResource = require('../../Resources/MessageResource')

class MessageController extends BaseController {

    /**
     * fetch a messages of an class
     * @author Anuj Jaiswar <anuj.jaiswar@tradofina.com>
     */
    getChatMessage = async (req, res) => {
        const validationErrors = await UtilHelper.validateFields(req.params, ['roomReferenceNumber']);
        if (validationErrors.length > 0) {
            const result = responseCodeMixin.getResponseCode('101');
            result.data = validationErrors;
            return this.response(result, res);
        }

        const roomReferenceNumber = req.params.roomReferenceNumber;
        const requestData = req.query;
        requestData['room_reference_number'] = roomReferenceNumber;
        // Convert camelCase to snake_case and lowercase all keys
        const toSnakeCase = str => str.replace(/([A-Z])/g, '_$1').toLowerCase();
        const normalizedRequestData = Object.keys(requestData).reduce((acc, key) => {
            acc[toSnakeCase(key)] = requestData[key]; 
            return acc;
        }, {});

        let result = responseCodeMixin.getResponseCode('1');
        const list = await MessageService.fetchChatMessages(normalizedRequestData);

        if (list && list.length > 0) {
            const formattedMessages = list.map(message => new MessageResource(message).format());
            result.data = formattedMessages;
        } else {
            result = responseCodeMixin.getResponseCode('104');
        }
        return this.response(result, res);
    }
    
}

module.exports = new MessageController()
