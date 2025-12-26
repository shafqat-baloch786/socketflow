const User = require('../models/User');

const chatSocket = (io, socket) => {
  // LOG: Fires the moment the frontend calls socket.connect()
  console.log(`--- NEW CONNECTION ATTEMPT: ${socket.id} ---`);

  // Handling login: Links the User ID to the Socket ID
  const handleLogin = async (userId) => {
    console.log(`!!! LOGIN EVENT RECEIVED !!! UserID: ${userId} | SocketID: ${socket.id}`);
    
    try {
      if (!userId) {
        console.log("❌ Login failed: No userId provided.");
        return;
      }

      // 1. Update the database
      const user = await User.findByIdAndUpdate(
        userId, 
        {
          isOnline: true,
          socketId: socket.id // Crucial for your sendMessage controller
        },
        { new: true }
      );

      if (user) {
        console.log(`✅ DATABASE UPDATED: ${user.name} linked to ${socket.id}`);
        
        // 2. JOIN PRIVATE ROOM
        // This allows you to use io.to(userId).emit(...) in other controllers
        socket.join(userId.toString());
        console.log(`🏠 User joined room: ${userId}`);

        // 3. Notify all other connected clients that this user is online
        socket.broadcast.emit('userStatusChanged', { 
          userId: userId, 
          isOnline: true 
        });
      } else {
        console.log(`❌ DATABASE ERROR: User ID ${userId} not found.`);
      }
    } catch (err) {
      console.error("Error in handleLogin:", err);
    }
  };

  // Handling disconnect: Cleanup to prevent "Zombie" online users
  const handleDisconnect = async () => {
    console.log(`--- DISCONNECT DETECTED: ${socket.id} ---`);
    try {
      // Find the user who owned this socket ID
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { 
          isOnline: false, 
          socketId: null, // Clear the ID so sendMessage knows they are gone
          lastSeen: new Date() 
        },
        { new: true }
      );
      
      if (user) {
        console.log(`🔴 User ${user.name} is now offline.`);
        // Notify others
        socket.broadcast.emit('userStatusChanged', { 
          userId: user._id, 
          isOnline: false 
        });
      }
    } catch (err) {
      console.error("Error in handleDisconnect:", err);
    }
  };

  // Listen for events from frontend
  socket.on('login', handleLogin);
  socket.on('disconnect', handleDisconnect);
};

module.exports = chatSocket;