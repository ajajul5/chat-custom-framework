const BaseRepository = require('./BaseRepository');
const RoomUser = require("../models/RoomUserModel")
class RoomUserRepository extends BaseRepository{
    constructor() {
        super(RoomUser); // Pass the Room model to the base repository
    }
}

module.exports = new RoomUserRepository()