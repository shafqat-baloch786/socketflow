require('dotenv').config();
const app = require('./app');
const http = require('http');
const connectDB = require('./database/db');
const { Server } = require('socket.io');
const socketInit = require('./socket');

const PORT = process.env.PORT || 4000;

// 1. Connect to Database
connectDB();

// 2. Create HTTP server
const server = http.createServer(app);

// 3. Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

// 4. Attach io to Express (optional but useful)
app.set('socketio', io);

// 5. Initialize/call socket connection handler
io.on('connection', socketInit(io));

// 6. Start server
server.listen(PORT, () => {
  console.log(`🚀 Socketflow server running on port ${PORT}`);
});
