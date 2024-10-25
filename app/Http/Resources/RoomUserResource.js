const BaseJsonResource = require('./BaseJsonResource'); // Adjust the path as necessary

class RoomUserResource extends BaseJsonResource {
    // Override the format method to customize the room resource
    format() {
        return {
            roomUserReferenceNumber : this.data.room_user_reference_number,
            roomReferenceNumber : this.data.room_reference_number,
            userReferenceNumber : this.data.user_reference_number,
            displayName : this.data.display_name,
            userRevoked : this.data.user_revoked
        }
    }
}

module.exports = RoomUserResource;