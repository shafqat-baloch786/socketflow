const Message = require('../models/Message');
const catchAsync = require('../utils/catch_async');
const User = require('../models/User');

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


// Create message into database and emit the sendMessage event to listen for receiver
const sendMessage = catchAsync(async (req, res, next) => {
    const { partnerId } = req.params;
    const { content } = req.body;
    const senderId = req.user._id;

    console.log("--- START SEND MESSAGE ---");
    console.log(`From: ${senderId} To: ${partnerId}`);

    // 1. Save to Database (Reliable Persistence)
    const newMessage = await Message.create({
        sender: senderId,
        receiver: partnerId,
        content: content
    });

    // 2. THE BRIDGE: Get the 'io' instance attached in app.js
    const io = req.app.get('socketio');

    // 3. Find the receiver to get their current active socketId
    const receiver = await User.findById(partnerId);

    if (receiver && receiver.socketId) {
        console.log(`Receiver Found. SocketID: ${receiver.socketId}`);
        // 4. Push ONLY to the receiver's current live connection
        const emitSuccess = io.to(receiver.socketId).emit('newMessage', newMessage);
        console.log(`Emit status: ${emitSuccess ? "SENT" : "FAILED"}`);
    } else {
        console.log("!!! EMIT FAILED: Receiver not found or has NO socketId in DB !!!");
        console.log("Receiver data:", receiver ? "Found but no socketId" : "Not found in DB");
    }

    console.log("--- END SEND MESSAGE ---");

    res.status(201).json({
        success: true,
        message: newMessage
    });
});



// Getting all chats
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
        // NEW: Fetch user details from the 'users' collection
        {
            $lookup: {
                from: "users", // Must match your MongoDB collection name for users
                localField: "_id",
                foreignField: "_id",
                as: "partnerDetails"
            }
        },
        { $unwind: "$partnerDetails" }, // Convert array to object
        { $sort: { lastTime: -1 } } // Sort sidebar by most recent message
    ]);

    res.status(200).json({ success: true, chats });
});


// UPDATED EXPORTS
module.exports = {
    getChatHistory,
    sendMessage,
    getAllChats,
};