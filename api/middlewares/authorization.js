const jwt = require('jsonwebtoken');
const User = require('../models/User');
const dotenv = require('dotenv');

dotenv.config();

const auth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token found!"
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
      return res.status(404).json({
        success: false,
        message: "User not found!"
      });
    }

    req.user = currentUser;
    console.log("User req", currentUser);
    next();

  } catch (error) {
    console.error(error);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token!"
    });
  }
};

module.exports = auth;
