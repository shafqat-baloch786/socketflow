const { searchUsers } = require('../controllers/user_controller');
const authorization = require('../middlewares/authorization');

const express = require('express');
const router = express.Router();


router.get('/users', authorization, searchUsers);


module.exports = router;