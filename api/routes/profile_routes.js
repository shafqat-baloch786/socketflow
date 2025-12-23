const app = require('../app');
const express = require('express');
const router = express.Router();
const { getProfile, editProfile } = require('../controllers/profile_controller');
const authorization = require('../middlewares/authorization');


router.get('/profile', authorization, getProfile);
router.patch('/edit-profile', authorization, editProfile);



module.exports = router




