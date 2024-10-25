const RoomUserService = require('./../../../Services/RoomUserService')
const ChatService = require('../../../Services/ChatService')
const {responseCodeMixin} = require("../../../../config/mixins")
const { UtilHelper } = require('../../../../config/helpers')
const moment = require('moment-timezone');
const RoomUserResource = require('../../Resources/RoomUserResource');
const MessageService = require('./../../../Services/MessageService')

module.exports = async (io, socket) => {
    console.log('connected with socket user:', socket.user)

    /**
     * This event used to join room
     * This event checks user revoking
     * @emits userRevoked - Here user has no access for this room
     * If user has proper access to this event then
     * @emits joinedRoom - This will make confirmation that user successfully joined room
     * @emits roomUsersList -This event is for all people get to know how many users are joined/disconnected from this room.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    socket.on('joinRoom', async () => {
        // Store all socket ids on redis  or try else
        // set user => socket array
        console.log('joinRoom socket.id',socket.id)
        const user = socket.user;
        console.log('Join Room user', user);
        const userRef = user.userReferenceNumber
        const socketId = socket.id
        const roomReferenceNumber = user.roomReferenceNumber
        const moderatorRoomId = `MODERATORS_${roomReferenceNumber}`
        const kickedRoomReferenceNumbers = `KICK_${roomReferenceNumber}`;
        if(user.userRevoked == '1') {
            let response = responseCodeMixin.getResponseCode(1)
            socket.join(kickedRoomReferenceNumbers);
            // await RedisService.storeUserInRoom(kickedRoomReferenceNumbers, userRef, socketId, user)
            socket.emit('kickedOutUser', response);
        } else {
            // await RedisService.storeUserInRoom(roomReferenceNumber, userRef, socketId, user)
            socket.join(roomReferenceNumber)
            if(user.role.toLowerCase() === 'moderator') {
                socket.join(moderatorRoomId)
                let kickedUsers = responseCodeMixin.getResponseCode(1)
                kickedUsers.data['list'] = [];
                console.log('kickedUsers', kickedUsers);
                io.to(roomReferenceNumber).emit('kickedUserList', kickedUsers)
            }
            console.log('user role', user.role);
            let response = responseCodeMixin.getResponseCode(1)
            response.data = user
            socket.emit('joinedRoom', response)
            let users = responseCodeMixin.getResponseCode(1)
            const clients = await io.in(socket.user.roomReferenceNumber).fetchSockets()
            users.data['list'] = clients.map(client => client.user)
            console.log('roomUsersList', users.data['list']);
            io.to(roomReferenceNumber).emit('roomUsersList', users)
        }
    })

    /**
     * This event used to send a message
     * This event also store all chats having between one to one or gorup chattings.
     * @emits receiveMessage - This event is send message back to same room except the user who send the msg. 
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    socket.on('sendMessage', async (message) => {
        console.log('sendMessage socket.user',socket.user)
        console.log('sendMessage socket.id',socket.id)
        console.log('sendMessage',message)
        const roomReferenceNumber = socket.user.roomReferenceNumber
        const moderatorRoomId = `MODERATORS_${roomReferenceNumber}`
        const kickedRoomReferenceNumbers = `KICK_${roomReferenceNumber}`;
        const user = socket.user
        
        message['messageReferenceNumber'] = 'MGRN'+UtilHelper.generateString()
        message['sendTime'] = moment().tz("Asia/Kolkata").format('ddd MMM DD HH:mm:ss [GMT]ZZ YYYY');
        let chatDaa = {...user , message}
        // console.log('chatDaa',chatDaa)
        // ChatService.storeGroupChat(chatDaa)
        let response = responseCodeMixin.getResponseCode(1)
        response.data = chatDaa
        if (user.role.toLowerCase() === 'moderator') {
            // If the sender is a moderator, broadcast the message to the entire room
            io.to(roomReferenceNumber).emit('receiveMessage', response)
        } else {
            // If the sender is a user, only broadcast the message to the moderators
            io.to(moderatorRoomId).emit('receiveMessage', response) // Broadcast to moderators
            // const targetSocketIds = await RedisService.getUserSocketIds(roomReferenceNumber, user.userReferenceNumber);
            // console.log('sendMessage|user|targetSocketIds', user.userReferenceNumber, targetSocketIds);
            // targetSocketIds.forEach(socketId => {
            //     io.to(socketId).emit('receiveMessage', response);
            // })
            // socket.emit('receiveMessage', response)
        }
    })    

    socket.on('disconnect', async () => {
        const roomReferenceNumber = socket.user.roomReferenceNumber;
        const moderatorRoomId = `MODERATORS_${roomReferenceNumber}`
        const kickedRoomReferenceNumbers = `KICK_${roomReferenceNumber}`;
        const user = socket.user

        console.log('disconnect socket.id', socket.id);
        try {
            // Remove the user's socket from the room in Redis
            // await RedisService.removeSocketFromUser(roomReferenceNumber, user.userReferenceNumber, socket.id)
            // await RedisService.removeSocketFromUser(kickedRoomReferenceNumbers, user.userReferenceNumber, socket.id)
            // Make the user leave the room
            if (user.role.toLowerCase() === 'moderator') {
                socket.leave(moderatorRoomId);
            }
            socket.leave(roomReferenceNumber);
            
            let response = responseCodeMixin.getResponseCode(1)
            // Notify the user that they have been disconnected
            socket.emit('disconnected', response);
            
            // Forcefully disconnect the socket
            socket.disconnect(true);
    
            // Log the disconnection event
            console.log(`User ${user.userReferenceNumber} has disconnected from room ${roomReferenceNumber}.`);
    
            // Optionally, update the room's user list for remaining users
            let users = responseCodeMixin.getResponseCode(1)
            const clients = await io.in(socket.user.roomReferenceNumber).fetchSockets()
            users.data['list'] = clients.map(client => client.user)
            io.to(roomReferenceNumber).emit('roomUsersList', users);
        } catch (error) {
            console.error(`Error disconnecting user from room ${roomReferenceNumber}:`, error);
            socket.emit('error', { message: 'An error occurred while disconnecting.' });
        }
    })
}