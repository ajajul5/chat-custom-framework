const BaseJsonResource = require('./BaseJsonResource'); // Adjust the path as necessary
const moment = require('moment')
class RoomResource extends BaseJsonResource {
    format() {
        return {
            roomReferenceNumber : this.data.room_reference_number,
            entityReferenceNumber : this.data.entity_reference_number,
            entityType : this.data.entity_type,
            status : this.data.status,
            createdAt : moment(this.data.created_at).format('YYYY-MM-DD HH:mm:ss'),
        }
    }
}

module.exports = RoomResource;