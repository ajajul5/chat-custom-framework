const RoomResource = require('../Http/Resources/RoomResource')
const RoomRepository = require('../Repositories/RoomRepository')
const { UtilHelper } = require('./../../config/helpers')
const { responseCodeMixin } = require('./../../config/mixins')
class RoomService {
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
        return await RoomRepository.all(payload)
    }

    fetchRoom = async (roomReferenceNumber) => {
        const condition = { room_reference_number: roomReferenceNumber,  }
        const room = await RoomRepository.findFirstByColumn(condition)
        return room
    }

    /**
     * Storing room details
     * 
     * @param {Object} body - The request body containing room information.
     * @returns {Object} - An object containing the response with room detils even if already exist.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    createRoom = async (payload) => {
        const isRoomExist = await RoomRepository.findFirstByColumn({ entity_reference_number: payload.entityReferenceNumber })
        
        if(isRoomExist) {
            return isRoomExist;
        } else {
            const newRoom = {
                room_reference_number : 'RMRN'+UtilHelper.generateString(),
                entity_reference_number : payload.entityReferenceNumber,
                entity_type : payload.entityType,
                status : 'CREATED',
            }
            return await RoomRepository.create(newRoom)
        }

        return response
    }

    /**
     * deleting a class
     * @param {String} roomReferenceNumber
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    deleteRoom = async (roomReferenceNumber) => {
        console.log('chat service deleteRoom', roomReferenceNumber);
        const condition = { room_reference_number: roomReferenceNumber }
        let isRoomExist = await RoomRepository.findFirstByColumn(condition)
        console.log('isRoomExist', isRoomExist);
        if(isRoomExist) {
            const affectedRow = await RoomRepository.update({status : 'DELETED'}, condition)
            isRoomExist.status = 'DELETED'
            return isRoomExist;
        } else {
            return false;
        }
    }
}

module.exports = new RoomService()