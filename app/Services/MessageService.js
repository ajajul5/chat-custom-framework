const MessageRepository = require('../Repositories/MessageRepository')
const { UtilHelper } = require('./../../config/helpers')
const { responseCodeMixin } = require('./../../config/mixins')
class MessageService {
    /**
     * Arrays of all required fields
     *
     * @returns {Array} - An object containing required fields
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    getRules = async () => {
        return [
            'entityReferenceNumber',
            'entityType',
        ]
    }

    getAll = async (payload) => {
        return await MessageRepository.all(payload)
    }

    fetchChatMessages = async (requestData) => {
        const room = await MessageRepository.findAllByColumn(requestData)
        return room
    }

    getAllChats = async (requestData) => {
        console.log('requestData', requestData);
        const userReferenceNumber = requestData.userReferenceNumber;
        const roomReferenceNumberObj = {
            room_reference_number : requestData.roomReferenceNumber,
        }
        if(requestData.role.toUpperCase() == 'MODERATOR') {
            return await MessageRepository.fetchAllChatsForModerator(roomReferenceNumberObj, userReferenceNumber);
        } else if(requestData.role.toUpperCase() == 'USER') {
            return await MessageRepository.fetchAllChatsforUser(roomReferenceNumberObj, userReferenceNumber);
        } else {
            return [];
        }
    }
}

module.exports = new MessageService()