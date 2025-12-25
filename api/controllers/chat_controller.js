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


    // An empty array is a valid response (new chat).
    res.status(200).json({
        success: true,
        count: messages.length,
        messages
    });
});

module.exports = { getChatHistory };