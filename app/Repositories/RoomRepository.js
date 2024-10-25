const BaseRepository = require('./BaseRepository');
const Room = require('../models/RoomModel')
class RoomRepository extends BaseRepository{
    constructor() {
        super(Room); // Pass the Room model to the base repository
    }
}

module.exports = new RoomRepository()