const { DataTypes } = require('sequelize')
const sequelize     = require('../../config/database')

/**
 * This is Chat Model
 * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
 */
const Chat = sequelize.define('Chat', {
    message_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    message: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    parent_message_reference_number: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    room_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    sender_type: {
        type: DataTypes.ENUM('USER','MODERATOR','ALL'),
        allowNull: true,
    },
    sender_display_name: {
        type: DataTypes.STRING,
        allowNull: false,
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
    message_deleted: {
        type: DataTypes.TINYINT,
        defaultValue : 0,
    },
    deleted_by: {
        type: DataTypes.ENUM('USER','MODERATOR'),
        allowNull: true,
    },
}, {
    tableName: 'tbl_chat_messages',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = Chat