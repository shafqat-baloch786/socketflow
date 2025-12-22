const catchAsync = require('../utils/catch_async');

// Get profile data
const getProfile = catchAsync(async (req, res) => {
    const user = req.user;
    
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        });
    }

    res.status(200).json({
        success: true,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            isOnline: user.isOnline,
            lastSeen: user.lastSeen,
            createdAt: user.createdAt
        }
    });
});

module.exports = {
    getProfile,
};
