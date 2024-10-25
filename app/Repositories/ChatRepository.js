const BaseRepository = require('./BaseRepository');
const Chat = require('../models/ChatModel')
class ChatRepository extends BaseRepository{
    constructor() {
        super(Chat); // Pass the Room model to the base repository
    }
}

module.exports = new ChatRepository()