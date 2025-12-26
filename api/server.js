require('dotenv').config();
const app = require('./app');
const http = require('http');
const connectDB = require('./database/db');
const { Server } = require('socket.io');
const socketHandler = require('./socket/index');

const PORT = process.env.PORT || 4000;

// 1. Connect to Database
connectDB();

const server = http.createServer(app);

// 2. Initialize Socket.io
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 3. CRITICAL: Attach io to the app instance 
// This makes req.app.get('socketio') work in your controllers
app.set('socketio', io);

// 4. Setup the Connection Listener
io.on('connection', (socket) => {
  console.log(`--- NEW SOCKET CONNECTED: ${socket.id} ---`);
  
  // Pass both the global 'io' and the specific 'socket' to your handler
  socketHandler(io, socket);
});

server.listen(PORT, () => {
  console.log(`Socketflow server is running on port ${PORT}`);
});