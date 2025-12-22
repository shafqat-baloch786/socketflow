const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/auth_controller');

// POST request to register a new user
router.post('/register', register);

// Login a user
router.post('/login', login);

module.exports = router;
