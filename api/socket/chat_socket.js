const User = require('../models/User');

const chatSocket = (io, socket) => {
  // LOG: This fires the moment a browser tab opens or refreshes
  console.log(`--- NEW CONNECTION ATTEMPT: ${socket.id} ---`);

  // Handling login: This must run every time the frontend connects/refreshes
  const handleLogin = async (userId) => {
    // DEBUG LOG: If you don't see this when you refresh the receiver's page, the frontend is broken
    console.log(`!!! LOGIN EVENT RECEIVED !!! UserID: ${userId} | SocketID: ${socket.id}`);
    
    try {
      if (!userId) {
        console.log("Login failed: No userId provided in emit.");
        return;
      }
      
      // Update user with the CURRENT socket.id
      const user = await User.findByIdAndUpdate(
        userId, 
        {
          isOnline: true,
          socketId: socket.id // This links the DB user to this specific connection
        },
        { new: true }
      );

      if (user) {
        // DEBUG LOG: Confirms the DB actually saved the ID
        console.log(`✅ DATABASE UPDATED: ${user.name} now has socketId: ${user.socketId}`);
        
        // Notify others for real-time green dots
        socket.broadcast.emit('userStatusChanged', { userId, isOnline: true });
      } else {
        console.log(`❌ DATABASE ERROR: User with ID ${userId} not found in DB.`);
      }
    } catch (err) {
      console.error("Error in socket handleLogin:", err);
    }
  };

  // Handling disconnect: Clean up so we don't try to send messages to a closed pipe
  const handleDisconnect = async () => {
    console.log(`--- DISCONNECT DETECTED: ${socket.id} ---`);
    try {
      const user = await User.findOneAndUpdate(
        { socketId: socket.id },
        { 
          isOnline: false, 
          socketId: null, 
          lastSeen: new Date() 
        },
        { new: true }
      );
      
      if (user) {
        console.log(`🔴 User ${user.name} unlinked from DB.`);
        socket.broadcast.emit('userStatusChanged', { userId: user._id, isOnline: false });
      }
    } catch (err) {
      console.error("Error in socket handleDisconnect:", err);
    }
  };

  socket.on('login', handleLogin);
  socket.on('disconnect', handleDisconnect);
};

module.exports = chatSocket;