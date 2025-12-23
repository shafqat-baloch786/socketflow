require('dotenv').config();

const http = require('http');
const app = require('./app');
const connectDB = require('./database/db');
const { Server } = require('socket.io');

// Connect database
connectDB();

// Create HTTP server
const server = http.createServer(app);

// Attach Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // Or your frontend URL
    methods: ['GET', 'POST']
  }
});

// Socket.IO connection
io.on('connection', (socket) => {
  console.log("New socket connected!", socket.id);

  socket.on('disconnect', () => {
    console.log("Socket disconnected!", socket.id);
  });
});

const PORT = process.env.PORT || 4000;
server.listen(PORT, () => {
  console.log(`SocketFlow Server running on port ${PORT}`);
});


