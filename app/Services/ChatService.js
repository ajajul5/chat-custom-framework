const { UtilHelper } = require("../../config/helpers")
const ChatRepository = require("../Repositories/ChatRepository")

class ChatService {

    /**
     * fetch chat
     *
     * @param {Object} chat - containing messageReferenceNumber to get the origninal message.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    fetchMessage = async (chat) => {
        const condition = {
            message_reference_number : chat.messageReferenceNumber,
        }
        const msg = await ChatRepository.findFirstByColumn(condition)
        return await this.chatResource(msg);
    }

    replyMessage = async (chat) => {
        // let msg = await this.fetchMessage(chat)
        console.log('chat', chat);
        
        const msg = await ChatRepository.findFirstByColumn({ message_reference_number : chat.message.parentMessageReferenceNumber})
        // console.log('replyMessage msg', msg);
        let receiverType = null
        if(chat.role.toUpperCase() === 'MODERATOR') {
            receiverType = 'USER'
        } else if(chat.role.toUpperCase() === 'USER') {
            receiverType = 'MODERATOR'
        }
        const chatData = {
            message_reference_number : chat.message.messageReferenceNumber,
            message : chat.message.text,
            parent_message_reference_number : chat.message.parentMessageReferenceNumber,
            room_reference_number : chat.roomReferenceNumber,
            sender_reference_number : chat.userReferenceNumber,
            sender_display_name : chat.attributes.display_name,
            sender_type : chat.role,
            receiver_reference_number : msg.sender_reference_number,
            receiver_display_name : msg.sender_display_name,
            receiver_type : receiverType,
            message_deleted : '0',
        }
        console.log('replyMessage store', chatData);
        const replyChat = await ChatRepository.create(chatData)
        chat.message.parentMessage = msg.message;
        chat.message.parentUserDisplayName = msg.sender_display_name;
        chat.message.receiverReferenceNumber = msg.sender_reference_number;
        return chat;
    } 


    /**
     * Storing chats.
     *
     * @param {Object} chat - containing user information and messages.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    storeGroupChat = async (chat) => {
        
        let receiverType = null
        if(chat.role.toUpperCase() === 'MODERATOR') {
            receiverType = 'ALL'
        } else if(chat.role.toUpperCase() === 'USER') {
            receiverType = 'MODERATOR'
        }
        const chatData = {
            message_reference_number : chat.message.messageReferenceNumber,
            message : chat.message.text,
            parent_message_reference_number : null,
            room_reference_number : chat.roomReferenceNumber,
            sender_reference_number : chat.userReferenceNumber,
            sender_display_name : chat.attributes.display_name,
            sender_type : chat.role,
            receiver_reference_number : null,
            receiver_display_name : null,
            receiver_type : receiverType,
            message_deleted : '0',
        }        

        ChatRepository.create(chatData)
    }

    /**
     * Storing chats.
     *
     * @param {Object} chat - containing user information and messages reference number.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    deleteChat = async (chat) => {
        console.log('Service deleteChat', chat);

        const condition = {
            sender_reference_number : chat.userReferenceNumber,
            room_reference_number : chat.roomReferenceNumber,
            message_reference_number : chat.messageReferenceNumber
        }
        ChatRepository.update({message_deleted:1}, condition)
    }

    /**
     * This function is ensure response
     * 
     * @returns {Object} - An object containing the token, issued_at, and expiry_at.
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    chatResource = async (chat) => {
        return {
            message_reference_number : chat.message_reference_number,
            text : chat.message,
            display_name : chat.sender_display_name,
            created_at : chat.created_at,
        }
    }
}

module.exports = new ChatService()