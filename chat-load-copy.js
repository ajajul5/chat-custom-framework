const { io } = require('socket.io-client');
const { performance } = require('perf_hooks');

// Test configuration
const CONFIG = {
  SERVER_URL: 'http://172.16.1.178:4000',
  NUMBER_OF_CLIENTS: 100,
  MESSAGES_PER_CLIENT: 10,
  DELAY_BETWEEN_MESSAGES: 100, // ms
  DELAY_BETWEEN_CLIENTS: 50    // ms
};

// Store for connected clients
const clients = new Map();
let totalMessagesReceived = 0;
let startTime;

// Create and connect a single client
async function createClient(id) {
  const socket = io(CONFIG.SERVER_URL);
  
  return new Promise((resolve) => {
    socket.on('connect', () => {
      console.log(`Client ${id} connected`);
      
      // Setup message receiver
      socket.on('chat-message', (data) => {
        totalMessagesReceived++;
        // console.log(`Client ${id} received message:`, data);
      });

      resolve(socket);
    });
  });
}

// Send messages from a client
async function sendMessages(socket, id) {
  for (let i = 0; i < CONFIG.MESSAGES_PER_CLIENT; i++) {
    const data = {
      name: `User ${id}`,
      message: `Message from client ${id}`,
      dateTime: new Date(),
    };
    
    socket.emit('message', data);
    await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_MESSAGES));
  }
}

// Main test function
async function runLoadTest() {
  console.log('Starting load test with configuration:', CONFIG);
  startTime = performance.now();

  // Connect all clients
  for (let i = 0; i < CONFIG.NUMBER_OF_CLIENTS; i++) {
    const socket = await createClient(i);
    clients.set(i, socket);
    await new Promise(resolve => setTimeout(resolve, CONFIG.DELAY_BETWEEN_CLIENTS));
  }

  console.log(`${CONFIG.NUMBER_OF_CLIENTS} clients connected`);

  // Send messages from all clients
  const sendPromises = Array.from(clients.entries()).map(([id, socket]) => 
    sendMessages(socket, id)
  );

  // Wait for all messages to be sent
  await Promise.all(sendPromises);

  // Wait a bit to receive remaining messages
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Calculate and display results
  const endTime = performance.now();
  const duration = (endTime - startTime) / 1000; // Convert to seconds
  const totalMessagesSent = CONFIG.NUMBER_OF_CLIENTS * CONFIG.MESSAGES_PER_CLIENT;
  
  console.log('\nTest Results:');
  console.log('-------------');
  console.log(`Duration: ${duration.toFixed(2)} seconds`);
  console.log(`Total Clients: ${CONFIG.NUMBER_OF_CLIENTS}`);
  console.log(`Messages Sent Per Client: ${CONFIG.MESSAGES_PER_CLIENT}`);
  console.log(`Total Messages Sent: ${totalMessagesSent}`);
  console.log(`Total Messages Received: ${totalMessagesReceived}`);
  console.log(`Messages Rate: ${(totalMessagesSent / duration).toFixed(2)} messages/second`);
  
  // Cleanup: disconnect all clients
  clients.forEach((socket, id) => {
    socket.disconnect();
    console.log(`Client ${id} disconnected`);
  });
}

// Run the test
runLoadTest().catch(console.error);