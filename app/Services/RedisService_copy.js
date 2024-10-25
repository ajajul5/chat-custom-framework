class RedisService {
    constructor(redisClient) {
        this.client = redisClient; // Use the provided Redis client
    }

    // Store a user in a room
    async storeUserInRoom(roomRef, userRef, userObject, socketId) {
        console.log('storeUserInRoom', roomRef, userRef, userObject, socketId);
        
        try {
            await this.client.hSet(`room:${roomRef}`, userRef, JSON.stringify(userObject));
            await this.client.sAdd(`user:${userRef}:sockets`, socketId);
        } catch (error) {
            console.error('Error storing user in room:', error);
        }
    }

    // Retrieve a user from a room
    async getUserInRoom(roomRef, userRef) {
        try {
            const userData = await this.client.hGet(`room:${roomRef}`, userRef);
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error retrieving user from room:', error);
            return null;
        }
    }

    // Get all socket IDs for a user
    async getUserSockets(userRef) {
        try {
            return await this.client.sMembers(`user:${userRef}:sockets`);
        } catch (error) {
            console.error('Error retrieving user sockets:', error);
            return [];
        }
    }

    // Remove a socket ID on disconnect and clean up if no sockets remain
    async removeSocketOnDisconnect(roomRef, userRef, socketId) {
        try {
            await this.client.sRem(`user:${userRef}:sockets`, socketId);
            const remainingSockets = await this.client.sCard(`user:${userRef}:sockets`);
            
            if (remainingSockets === 0) {
                await this.client.hDel(`room:${roomRef}`, userRef);
                await this.client.del(`user:${userRef}:sockets`);
            }
        } catch (error) {
            console.error('Error removing socket on disconnect:', error);
        }
    }

    // Get all users in a room
    async getAllUsersInRoom(roomRef) {
        try {
            const users = await this.client.hGetAll(`room:${roomRef}`);
            return Object.keys(users).map(userRef => JSON.parse(users[userRef]));
        } catch (error) {
            console.error('Error retrieving users from room:', error);
            return [];
        }
    }

    // Clean up room on disconnection (optional if you want to delete the room)
    async cleanUpRoom(roomRef) {
        try {
            await this.client.del(`room:${roomRef}`);
        } catch (error) {
            console.error('Error cleaning up room:', error);
        }
    }

    // Publish message (for pub/sub feature)
    async publishMessage(roomRef, message) {
        try {
            await this.client.publish(`room:${roomRef}`, message);
        } catch (error) {
            console.error('Error publishing message to room:', error);
        }
    }
}

module.exports = (redisClient) => new RedisService(redisClient);