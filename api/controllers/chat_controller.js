const Message = require('../models/Message');
const catchAsync = require('../utils/catch_async');

const getChatHistory = catchAsync(async (req, res, next) => {
    const { partnerId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
        $or: [
            {
                sender: userId,
                receiver: partnerId
            },
            {
                sender: partnerId,
                receiver: userId
            }
        ]
    })
    .sort({ createdAt: 1 })
    .limit(50);

    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });
});

// ADDED THIS: The missing function for sending messages
const sendMessage = catchAsync(async (req, res, next) => {
    const { partnerId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    const newMessage = await Message.create({
        sender: senderId,
        receiver: partnerId,
        content: content
    });

    res.status(201).json({
        success: true,
        message: newMessage
    });
});

// UPDATED EXPORTS
module.exports = { 
    getChatHistory, 
    sendMessage 
};