
// const chatSocket = require('./chat_socket');

// const socketHandler = (io) => {
//   io.on('connection', (socket) => {
//     console.log(`✅ New client connected: ${socket.id}`);

//     // Attach chatSocket events
//     chatSocket(io, socket);

//     socket.on('disconnect', () => {
//       console.log(`❌ Client disconnected: ${socket.id}`);
//     });
//   });
// };

// module.exports = socketHandler;







const socketHandler = (io) => {
  io.on('connection', (socket) => {
    console.log("Socket connected:", socket.id);

    io.on('disconnect', () => {
      console.log("Connection closed!");
    })


  });
}



module.exports = socketHandler;

























