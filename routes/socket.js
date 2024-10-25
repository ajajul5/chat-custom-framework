require('dotenv').config()
const express = require('express')
const webRouter = express.Router()
const ChatController = require('../app/Http/Controllers/V1/ChatController')
const AuthService = require('../app/Services/AuthService')
const { createAdapter } = require('@socket.io/redis-adapter')
const { createClient } = require('redis')
const RedisService = require('../app/Services/RedisService')

module.exports = async (io) => {
    /**
     * This middle ware ensure socket connection is generic
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    io.use( async (socket, next) => {
        let tokenHeader = null
        let token = null;
        if (socket.handshake.query.token) {
            token = socket.handshake.query.token;
        }

        if (!token) {
            return next(new Error('Authentication error: Token missing'))
        } else {
            const decodedToken = await AuthService.verifyToken(token)
            if (decodedToken.success) {
                socket.user = decodedToken.userData
                next()
            } else {             
                return next(new Error('Invalid Token'))
            }
        }
    })

    // const redisUrl = `redis://:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/${process.env.REDIS_DB}`;
    // const pubClient = createClient({ url: redisUrl })
    // const subClient = pubClient.duplicate()
    // pubClient.on('error', (err) => console.error('Redis Pub Client Error:', err))
    // subClient.on('error', (err) => console.error('Redis Sub Client Error:', err))
    // await Promise.all([
    //     pubClient.connect(),
    //     subClient.connect(),
    // ])
    
    // io.adapter(createAdapter(pubClient, subClient))
    // const redisService = new RedisService(pubClient);
    /**
     * If socket connection is generic connection event will be executed
     * @author Ajajul Ansari <ajajul.ansari@tradofina.com>
     */
    io.on('connection', (socket) => {
        console.log('connection event socket.id', socket.id)
        ChatController(io, socket)
    })

    return webRouter
}