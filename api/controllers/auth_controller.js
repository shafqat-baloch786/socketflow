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


// Login user
const login = catchAsync(async (req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    // Checking if user is already registerd
    if (!user) {
        return next(new ErrorHandler("User not found", 404));
    }

    const isPasswordMatched = await user.comparePassword(password);
    if(!isPasswordMatched) {
        return next(new ErrorHandler("Invalid email or password!", 400));
    }

    const token = auth(user._id);
    return res.status(200).json({
        token,
        success: true,
        message: "User logged in successfuly!",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    });

});


module.exports = {
    register,
    login,
}