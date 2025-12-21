const express = require('express');
const router = express.Router();
const { register } = require('../controllers/auth_controller');

// POST request to register a new user
router.post('/register', register);

module.exports = router;
