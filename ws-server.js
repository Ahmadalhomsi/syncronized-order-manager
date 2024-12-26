const { WebSocketServer } = require('ws');

const PORT = 8080;
const wss = new WebSocketServer({ port: PORT });

let clients = [];

wss.on('connection', (socket) => {
  console.log('New client connected');
  clients.push(socket);

  socket.on('message', (data) => {
    console.log('Received:', data.toString());
    // Broadcast the message to all connected clients
    clients.forEach((client) => {
      if (client.readyState === client.OPEN) {
        client.send(data.toString());
      }
    });
  });

  socket.on('close', () => {
    console.log('Client disconnected');
    clients = clients.filter((client) => client !== socket);
  });
});

console.log(`WebSocket server running on ws://localhost:${PORT}`);
