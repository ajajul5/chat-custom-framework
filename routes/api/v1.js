const express        = require('express')
const apiRouter      = express.Router()
const path           = require('path')
const AuthController = require('./../../app/Http/Controllers/V1/AuthController')
const RoomController = require('./../../app/Http/Controllers/V1/RoomController')
// const RoomUserController = require('./../../app/Http/Controllers/V1/RoomUserController')
const authMiddleware = require('./../../app/Http/middleware/AuthMiddleware')
const RoomUserController = require('../../app/Http/Controllers/V1/RoomUserController')
const MessageController = require('../../app/Http/Controllers/V1/MessageController')

// Define routes for v1

// Token Create
apiRouter.post('/jwt/token', AuthController.create)

// Rooms
apiRouter.get('/room', RoomController.index)
apiRouter.post('/room/create', RoomController.create)
apiRouter.get('/room/:roomReferenceNumber', RoomController.show)
apiRouter.delete('/room/:roomReferenceNumber', RoomController.destroy)
apiRouter.get('/room-user', RoomUserController.index)
apiRouter.get('/room-user/:roomUserReferenceNumber', RoomUserController.show)
// apiRouter.post('/room-user/create', RoomUserController.create)
apiRouter.get('/chat-message/:roomReferenceNumber', MessageController.getChatMessage)

module.exports = apiRouter