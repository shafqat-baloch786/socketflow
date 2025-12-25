const Message = require('../models/Message');
const User = require('../models/User');

const chatSocket = (io, socket) => {
    socket.on('sendMessage', async ({ senderId, receiverId, message }) => {
        try {
            // 1. Save message to Database
            const newMessage = await Message.create({
                sender: senderId,
                receiver: receiverId,
                content: message
            });

            const receiver = await User.findById(receiverId);

            // 2. Emit to receiver if online
            if (receiver && receiver.socketId) {
                io.to(receiver.socketId).emit('newMessage', newMessage);
            }

            // 3. Emit back to sender to confirm "Sent"
            socket.emit('messageSent', newMessage);

        } catch (error) {
            console.error("Error saving message:", error);
        }
    });
};

module.exports = chatSocket;