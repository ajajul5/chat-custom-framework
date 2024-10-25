const BaseJsonResource = require('./BaseJsonResource'); // Adjust the path as necessary
const moment = require('moment')
class MessageResource extends BaseJsonResource {
    format() {
        return {
            messageReferenceNumber : this.data.message_reference_number,
            roomReferenceNumber : this.data.room_reference_number,
            senderType : this.data.sender_type,
            senderDisplayName : this.data.sender_display_name,
            receiverType : this.data.receiver_type,
            parent_message_reference_number : this.data.parent_message_reference_number,
            message : this.data.message,
            createdAt : moment(this.data.created_at).format('YYYY-MM-DD HH:mm:ss'),
        }
    }
}

module.exports = MessageResource;