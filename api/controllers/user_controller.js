const User = require('../models/User');
const catchAsync = require('../utils/catch_async');


// Search users by name or email
const searchUsers = catchAsync(async (req, res, next) => {
    const { query } = req.query;
    const currentUserId = req.user._id;

    // If no query is provided, return an empty list or an error
    if (!query) {
        return res.status(400).json({
            success: false,
            message: "Search query is required"
        });
    }

    const users = await User.find({
        _id: { $ne: currentUserId },
        $or: [
            {
                name: {
                    $regex: query,
                    $options: 'i'
                }
            },
            {
                email: {
                    $regex: query,
                    $options: 'i'
                }
            }
        ]
    }).select('name email avatar isOnline');

    return res.status(200).json({
        success: true,
        users,
    });
});

module.exports = { searchUsers };