const chatSocket = require('./chat_socket');

const socketInit = (io) => {
  return (socket) => {
    console.log(`--- NEW SOCKET CONNECTED: ${socket.id} ---`);

    chatSocket(io, socket);

    socket.on('disconnect', () => {
      console.log(`--- SOCKET DISCONNECTED: ${socket.id} ---`);
    });
  };
};

module.exports = socketInit;