require('dotenv').config();
const app = require('./app');
const http = require('http');
const connectDB = require('./database/db');
const { Server } = require('socket.io');
// const socketHandler = require('./sockets/chat_socket');

const PORT = process.env.PORT || 4000;

// Connect to Database
connectDB();

const server = http.createServer(app);

// Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// Pass the io instance to your socket controller
// socketHandler(io);

server.listen(PORT, () => {
  console.log(`Socketflow server is running on port ${PORT}`);
});