class RedisService {
    constructor(redisClient) {
        this.client = redisClient;
    }

    async storeUserInRoom(roomRefNo, userRefNo, socketId, user) {
        const roomKey = `room:${roomRefNo}`;
        const userKey = `${roomKey}:${userRefNo}`;
    
        try {
            // Check if the room exists
            const roomExists = await this.client.exists(roomKey);
    
            if (!roomExists) {
                // If room doesn't exist, create it
                await this.client.hSet(roomKey, userRefNo, JSON.stringify(user));
            } else {
                // If room exists, check if user exists in the room
                const userExists = await this.client.hExists(roomKey, userRefNo);

                if (!userExists) {
                    // If user doesn't exist in the room, add them
                    await this.client.hSet(roomKey, userRefNo, JSON.stringify(user));
                }
            }
    
            // Add the socket ID to the user's list of socket IDs
            await this.client.rPush(userKey, socketId);
    
            console.log(`Socket ID ${socketId} added for user ${userRefNo} in room ${roomRefNo}`);
        } catch (err) {
            console.error('Error managing user in Redis:', err);
            throw err;
        }
    }

    async removeSocketFromUser(roomRefNo, userRefNo, socketId = null) {
        const roomKey = `room:${roomRefNo}`;
        const userKey = `${roomKey}:${userRefNo}`;
    
        try {
            if (socketId) {
                // Remove a specific socket ID from the user's list
                await this.client.lRem(userKey, 0, socketId);
            } else {
                // Remove all socket IDs and the user if socketId is null
                await this.client.del(userKey); // Remove the user's socket list
            }
    
            // Check if any sockets remain
            const remainingSockets = await this.client.lLen(userKey);
            if (remainingSockets === 0 || socketId === null) {
                // Remove the user if no sockets remain or if we're removing all sockets
                await this.client.hDel(roomKey, userRefNo);
            }
    
            console.log(`User ${userRefNo} removed from room ${roomRefNo}`);
        } catch (err) {
            console.error('Error removing user from Redis:', err);
            throw err;
        }
    }

    async getUserSocketIds(roomRefNo, userRefNo) {
        const roomKey = `room:${roomRefNo}`;
        const userKey = `${roomKey}:${userRefNo}`;
    
        try {
            // Check if the user exists in the room
            const userExists = await this.client.hExists(roomKey, userRefNo);
    
            if (!userExists) {
                console.log(`User ${userRefNo} not found in room ${roomRefNo}`);
                return [];
            }
    
            // Fetch all socket IDs for the user
            const socketIds = await this.client.lRange(userKey, 0, -1);
    
            console.log(`Fetched ${socketIds.length} socket IDs for user ${userRefNo} in room ${roomRefNo}`);
            return socketIds;
        } catch (err) {
            console.error('Error fetching user socket IDs from Redis:', err);
            throw err;
        }
    }

    async getUserFromRoom(roomRefNo, userRefNo) {
        const roomKey = `room:${roomRefNo}`;

        try {
            // Check if the user exists in the room
            const userExists = await this.client.hExists(roomKey, userRefNo);

            if (!userExists) {
                console.log(`User ${userRefNo} not found in room ${roomRefNo}`);
                return null; // User not found
            }

            // Fetch the user data from Redis
            const userJson = await this.client.hGet(roomKey, userRefNo);
            const user = JSON.parse(userJson); // Parse the JSON to get the user object

            console.log(`Fetched user ${userRefNo} from room ${roomRefNo}`);
            return user;
        } catch (err) {
            console.error('Error fetching user from Redis:', err);
            throw err;
        }
    }

    
    async getUsersInRoom(roomRefNo) {
        const roomKey = `room:${roomRefNo}`;
    
        try {
            // Get all user objects in the room
            const users = await this.client.hGetAll(roomKey);
    
            // For each user, get their socket IDs and parse the user object
            const usersWithSockets = await Promise.all(
                Object.entries(users).map(async ([userRefNo, userJson]) => {
                    try {
                        const user = JSON.parse(userJson);  // Parse the user object stored in Redis
                        const socketIds = await this.client.lRange(`${roomKey}:${userRefNo}`, 0, -1);
                        return { user, socketIds };
                    } catch (err) {
                        console.error(`Failed to parse user data for ${userRefNo} in room ${roomRefNo}: ${userJson}`);
                        return null;  // Optionally return null for invalid data
                    }
                })
            );
    
            // Filter out any null values (in case of parsing errors)
            return usersWithSockets.filter(user => user !== null);
        } catch (err) {
            console.error('Error getting users in room from Redis:', err);
            throw err;
        }
    }
    
    async deleteRoom(roomRefNo) {
        const roomKey = `room:${roomRefNo}`;
    
        try {
            // Get all users in the room
            const users = await this.client.hGetAll(roomKey);
    
            // Delete each user's socket list and remove them from the room
            for (const [userRefNo] of Object.entries(users)) {
                await this.client.del(`${roomKey}:${userRefNo}`);  // Delete each user's socket list
            }
    
            // Delete the room itself
            await this.client.del(roomKey);
    
            console.log(`Room ${roomRefNo} and all associated user data deleted`);
        } catch (err) {
            console.error('Error deleting room from Redis:', err);
            throw err;
        }
    }
}

module.exports = RedisService;