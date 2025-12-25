// const Message = require('../models/Message');
// const User = require('../models/User');

// const chatSocket = (io, socket) => {


//   // Handling login
//   const handleLogin = async (userId) => {
//     await User.findByIdAndUpdate(userId, {
//       isOnline: true,
//       socketId: socket.id
//     });
//   };

//   // Handling messages
//   const handleSendMessage = async ({ senderId, receiverId, message }) => {
//     const newMessage = await Message.create({
//       sender: senderId,
//       receiver: receiverId,
//       content: message
//     });

//     const receiver = await User.findById(receiverId);

//     if (receiver?.socketId) {
//       io.to(receiver.socketId).emit('newMessage', newMessage);
//     }

//     socket.emit('messageSent', newMessage);
//   };


//   // Handling disconnect
//   const handleDisconnect = async () => {
//     const user = await User.findOne({ socketId: socket.id });
//     if (user) {
//       user.isOnline = false;
//       user.socketId = null;
//       user.lastSeen = new Date();
//       await user.save();
//     }
//   };

//   // Applying events on above controllers
//   socket.on('login', handleLogin);
//   socket.on('sendMessage', handleSendMessage);
//   socket.on('disconnect', handleDisconnect);
// };

// module.exports = chatSocket;
