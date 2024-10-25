const { DataTypes } = require('sequelize')
const sequelize     = require('../../config/database')

/**
 * This is RoomUser Model
 * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
 */
const RoomUser = sequelize.define('RoomUser', {
    room_user_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    room_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    display_name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    user_revoked: {
        type: DataTypes.TINYINT,
        allowNull: false,
    },
}, {
    tableName: 'tbl_room_user',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})
module.exports = RoomUser