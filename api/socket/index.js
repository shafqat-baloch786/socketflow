const chatSocket = require('./chat_socket');


// Define socketInit and call it from server.js
const socketInit = (io) => {

  // Return anotehr arrow function that takes socket as parameter
  return (socket) => {
    console.log(`--- NEW SOCKET CONNECTED: ${socket.id} ---`);


    // Calling the chatSocket function to handle chat related events
    chatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`--- SOCKET DISCONNECTED: ${socket.id} ---`);
    });
  };
};

module.exports = socketInit;