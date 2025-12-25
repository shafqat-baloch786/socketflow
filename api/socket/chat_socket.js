const Message = require('../models/Message');
const User = require('../models/User');


const chatSocket = (io, socket) => {


    // Logging  a user in
    const handleLogin = async (userId) => {
        try {
            await User.findByIdAndUpdate(userId, {
                isOnline: true,
                socketId: socket.id,
            });
        } catch (error) {
            console.log("Error while logging event!", error)
        }
    }


    // Sending messages
    const handleSendMessage = async ({ senderId, receiverId, message }) => {
        try {
            const newMessage = await Message.create({
                sender: senderId,
                receiver: receiverId,
                message: message
            });

            const receiver = await User.findById(receiverId);
            if (receiver?.socketId) {
                io.to(receiver.socketId).emit('newMessage', newMessage);
            }

            socket.emit('messageSent', newMessage);
        } catch (error) {
            console.log("Error while sending message!", error);
        }
    }


    // Handling disconnect

    const handleDisconnect = async () => {
        try {
            const user = await User.find({ socketId: socket.id });
            if (user) {
                user.isOnline = false;
                user.socketId = null;
                user.lastSeen = new Date();
                await user.save();
            }
        } catch (error) {
            console.log("Error while disconnecting!", error)
        }
    }


    socket.on('login', handleLogin);
    socket.on('sendMessage', handleSendMessage);
    socket.on('disconnect', handleDisconnect);
}


module.exports = chatSocket;