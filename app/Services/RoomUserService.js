const RoomUserRepository = require('../Repositories/RoomUserRepository')
const RoomRepository = require('../Repositories/RoomRepository')
const {responseCodeMixin} = require('../../config/mixins')
const { UtilHelper } = require('./../../config/helpers')
const RoomUserResource = require('../Http/Resources/RoomUserResource')
class RoomUserService {
    /**
     * Arrays of all required fields
     *
     * @returns {Array} - An object containing required fields
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    getRules = async () => {
        return [
            'userReferenceNumber',
            'userDisplayName',
            'entityReferenceNumber',
            'entityType',
        ]
    }
    
    getAll = async (payload) => {
        return await RoomUserRepository.all(payload)
    }


    fetchRoom = async (roomUserReferenceNumber) => {
        const condition = { room_user_reference_number: roomUserReferenceNumber,  }
        const room = await RoomUserRepository.findFirstByColumn(condition)
        return room
    }

    /**
     * This function insure that user is mapped to a class room
     * 
     * @param {Object} payload - token containing student information.
     * @returns {Object} - An object containing the user room data.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    createRoomUser = async (payload) => {
        console.log('payload', payload);
        
        let response = responseCodeMixin.getResponseCode(1)
        // const getRoomDetail = await RoomRepository.findFirstByColumn({
        //     entity_reference_number : payload.entityReferenceNumber,
        //     entity_type : 'CLASS',
        // })

        // console.log('getRoomDetail', getRoomDetail)

        // if(!getRoomDetail) {
        //    response = responseCodeMixin.getResponseCode(104)
        //    response.message = 'Room not found'
        //    return response
        // }

        // const isRoomUserExist = await RoomUserRepository.findFirstByColumn({
        //     user_reference_number: payload.userReferenceNumber,
        //     room_reference_number: getRoomDetail.room_reference_number,
        // })

        // console.log('isRoomUserExist', isRoomUserExist)

        // if(!isRoomUserExist) {
            const newRoomUser = await RoomUserRepository.create({
                room_user_reference_number : 'RURN'+UtilHelper.generateString(),
                room_reference_number : 'RMRN21759276283ZG2BX',
                user_reference_number : payload.userReferenceNumber,
                display_name : payload.attributes.display_name,
                user_revoked : '0',
            })
            response.data['room_user'] = newRoomUser
        // } else {
        //     response.data['room_user'] = isRoomUserExist
        // }

        return response
    }

    // storeRoomUser = async (payload) => {

    // }

    getRoomUser = async (roomUserReferenceNumber) => {
        return await RoomUserRepository.findFirstByColumn({
            room_user_reference_number : roomUserReferenceNumber
        })
    }

    getKickedUsers = async (roomReferenceNumber) => {
        return await RoomUserRepository.findAllByColumn({
            room_reference_number : roomReferenceNumber,
            user_revoked : 1,
        })
    }

    /**
     * This function is checking that user has access to room.
     * 
     * @returns {Boolean} 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    isUserRevokedFromClass = async (payload) => {
        const roomUser = await RoomUserRepository.findFirstByColumn({
            user_reference_number : payload.userReferenceNumber,
            room_reference_number : payload.roomReferenceNumber,
        })
        
        return roomUser.user_revoked == 1 ? true : false
    }

    revokeUserFromRoom = async (payload) => {
        return await RoomUserRepository.update({
            user_revoked : 1,
        },
        {
            user_reference_number : payload.userReferenceNumber,
            room_reference_number : payload.roomReferenceNumber,
        })
    }

    allowUserToRoom = async (payload) => {
        return await RoomUserRepository.update({
            user_revoked : 0,
        },
        {
            user_reference_number : payload.userReferenceNumber,
            room_reference_number : payload.roomReferenceNumber,
        })
    }
}

module.exports = new RoomUserService()