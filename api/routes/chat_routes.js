const { getChatHistory } = require('../controllers/chat_controller');
const authorization = require('../middlewares/authorization');
const express = require('express');
const router = express.Router();


router.get('/chat/:parnterId', authorization, getChatHistory);


module.exports = router;