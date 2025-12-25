const { searchUsers, allUsers } = require('../controllers/user_controller');
const authorization = require('../middlewares/authorization');

const express = require('express');
const router = express.Router();


// All users
router.get('/users', authorization, allUsers);

// Searched users
router.get('/user', authorization, searchUsers);


module.exports = router;