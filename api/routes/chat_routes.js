const express = require('express');
const router = express.Router();
// 1. Make sure to import BOTH functions from the controller
const { getChatHistory, sendMessage, getAllChats } = require('../controllers/chat_controller');
const authorization = require('../middlewares/authorization');

// 2. GET request to fetch history
router.get('/all-chats', authorization, getAllChats);


// Corrected the typo from ':parnterId' to ':partnerId'
router.get('/:partnerId', authorization, getChatHistory);

// 3. POST request to actually send a message
router.post('/:partnerId', authorization, sendMessage);

module.exports = router;