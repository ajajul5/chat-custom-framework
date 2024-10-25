const { DataTypes } = require('sequelize')
const sequelize     = require('../../config/database')

/**
 * This is Message Model
 * @author Anuj Jaiswar <anuj.jaiswar@tradofina.com>
 */
const Message = sequelize.define('Message', {
    message_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    parent_message_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    room_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sender_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    sender_type: {
        type: DataTypes.ENUM('USER','MODERATOR'),
        allowNull: true,
    },
    sender_display_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    receiver_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    receiver_type: {
        type: DataTypes.ENUM('USER','MODERATOR','ALL'),
        allowNull: true,
    },
    receiver_display_name: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    tableName: 'tbl_chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

Message.belongsTo(Message, {
    foreignKey: 'parent_message_reference_number',
    targetKey: 'message_reference_number',
    as : 'pm'
});


module.exports = Message