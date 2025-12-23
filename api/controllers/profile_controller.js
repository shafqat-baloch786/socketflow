const catchAsync = require('../utils/catch_async');
const User = require('../models/User');
const mongoose = require('mongoose');

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


// Editing/updating profile
const editProfile = catchAsync(async (req, res, next) => {

    const id = req.user._id;
    const allowedFields = ['name', 'email', 'avatar'];
    const updates = {};

    allowedFields.forEach(field => {
        if (req.body[field] !== undefined) {
            updates[field] = req.body[field];
        }
    });

    // Check if updates is empty or not
    if (Object.keys(updates).length === 0) {
        return res.status(400).json({
            message: "No valid field provided!"
        });
    }

    // Find user by ID and update
    const user = await User.findByIdAndUpdate(
        {
            _id: id,
        },
        {
            $set: updates,
        },
        {
            new: true,
            runValidators: true,
        }
    )

    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found!"
        });
    }


    return res.status(200).json({
        user,
        success: true,
        message: "User updated successfully!"
    });

});

module.exports = {
    getProfile,
    editProfile,
};
