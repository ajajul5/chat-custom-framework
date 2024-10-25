const BaseRepository = require('./BaseRepository');
const { Sequelize, Op } = require('sequelize');
const Message = require('../models/MessageModel')
class MessageRepository extends BaseRepository{
    constructor() {
        super(Message); // Pass the Message model to the base repository
    }

    fetchAllChatsForModerator = async (condition, userReferenceNumber) => {
      return await Message.findAll({
          attributes: [
            'message_reference_number',
            'sender_display_name',
            'message',
            'message_deleted',
            'parent_message_reference_number',
            [Sequelize.col('pm.message'), 'parent_message'],
            [Sequelize.col('pm.sender_display_name'), 'parent_display_name'],
            [Sequelize.col('pm.sender_reference_number'), 'receiver_reference_number'],
            'room_reference_number',
            'sender_reference_number',
            'sender_type',
            [Sequelize.literal(`IF(Message.sender_reference_number = '${userReferenceNumber}', 'ME', 'OTHER')`), 'sent_by'],
          ],
          include: [{
            model: Message,
            as: 'pm',
            attributes: [],
          }],
          where: {
              room_reference_number: condition.room_reference_number,
              message_deleted: 0,
          },
      });
    };

    fetchAllChatsforUser = async (condition, userReferenceNumber) => {
        return await Message.findAll({
          attributes: [
            'message_reference_number',
            'sender_display_name',
            'message',
            'message_deleted',
            'parent_message_reference_number',
            [Sequelize.col('pm.message'), 'parent_message'],
            [Sequelize.col('pm.sender_display_name'), 'parent_display_name'],
            [Sequelize.col('pm.sender_reference_number'), 'receiver_reference_number'],
            'room_reference_number',
            'sender_reference_number',
            'sender_type',
            [Sequelize.literal(`IF(Message.sender_reference_number = '${userReferenceNumber}', 'ME', 'OTHER')`), 'sent_by'],
            'created_at',
          ],
          include: [{
            model: Message,
            as: 'pm',
            attributes: [],
          }],
          where: {
            room_reference_number: condition.room_reference_number,
            message_deleted: 0,
            [Op.or]: [
              {
                [Op.and]: [
                  { sender_type: 'USER' },
                  { sender_reference_number: userReferenceNumber }
                ]
              },
              {
                [Op.and]: [
                  { sender_type: 'MODERATOR' },
                  {
                    [Op.or]: [
                      { receiver_type: 'ALL' },
                      {
                        [Op.and]: [
                          { receiver_reference_number: userReferenceNumber },
                          { receiver_type: 'USER' }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
        },  
    });
  }
}

module.exports = new MessageRepository()