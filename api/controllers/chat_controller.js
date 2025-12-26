const Message = require('../models/Message');
const catchAsync = require('../utils/catch_async');
const User = require('../models/User');

// Fetches recent message history between two users
const getChatHistory = catchAsync(async (req, res, next) => {
    const { partnerId } = req.params;
    const userId = req.user._id;

    const messages = await Message.find({
        $or: [
            { sender: userId, receiver: partnerId },
            { sender: partnerId, receiver: userId }
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

// Saves message to DB and emits to the receiver's private room
const sendMessage = catchAsync(async (req, res, next) => {
    const { partnerId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    // 1. Persist message to Database
    const newMessage = await Message.create({
        sender: senderId,
        receiver: partnerId,
        content: content
    });

    // 2. Retrieve the IO instance
    const io = req.app.get('socketio');

    // 3. Emit to the Receiver's Room (Industry Standard)
    if (io) {
        io.to(partnerId.toString()).emit('newMessage', newMessage);
    }

    res.status(201).json({
        success: true,
        message: newMessage
    });
});

// Aggregates all conversations for the sidebar
const getAllChats = catchAsync(async (req, res, next) => {
    const userId = req.user._id;

    const chats = await Message.aggregate([
        { $match: { $or: [{ sender: userId }, { receiver: userId }] } },
        { $sort: { createdAt: -1 } },
        {
            $group: {
                _id: {
                    $cond: [{ $eq: ["$sender", userId] }, "$receiver", "$sender"]
                },
                lastMessage: { $first: "$content" },
                lastTime: { $first: "$createdAt" }
            }
        },
        {
            $lookup: {
                from: "users", 
                localField: "_id",
                foreignField: "_id",
                as: "partnerDetails"
            }
        },
        { $unwind: "$partnerDetails" },
        { $sort: { lastTime: -1 } }
    ]);

    res.status(200).json({ success: true, chats });
});

module.exports = {
    getChatHistory,
    sendMessage,
    getAllChats,
};