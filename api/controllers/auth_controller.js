const catchAsync = require('../utils/catch_async');
const User = require('../models/User');
const ErrorHandler = require('../utils/Error_handler');
const auth = require('../utils/generate_token');


// Registering a new user
const register = catchAsync(async (req, res, next) => {
    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    // Chack if user already exists
    if (userExists) {
        return next(new ErrorHandler("User alread exists!", 400));
    }

    const newUser = await User.create({
        name,
        email,
        password
    });

    // Generating the token
    const token = auth(newUser._id);

    res.status(201).json({
        success: true,
        message: "User created successfuly!",
        token: token,
        user: {
            id: newUser._id,
            name: newUser.name,
            email: newUser.email,
            avatar: newUser.avatar
        }
    })
});


module.exports = {
    register,
}