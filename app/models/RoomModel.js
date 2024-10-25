const { DataTypes } = require('sequelize')
const sequelize     = require('../../config/database')

/**
 * This is Room Model
 * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
 */
const Room = sequelize.define('Room', {
    entity_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    room_reference_number: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    entity_type: {
        type: DataTypes.ENUM('CLASS'),
        allowNull: true,
    },
    status: {
        type: DataTypes.ENUM('CREATED','FAILED','DELETED'),
        allowNull: true,
    },
}, {
    tableName: 'tbl_rooms',
    timestamps: true,
    createdAt: 'created_at',
    updatedAt: 'updated_at',
})

module.exports = Room