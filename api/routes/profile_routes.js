const app = require('../app');
const express = require('express');
const router = express.Router();
const { getProfile } = require('../controllers/profile_controller');
const authorization = require('../middlewares/authorization');


router.get('/profile', authorization, getProfile);



module.exports = router




