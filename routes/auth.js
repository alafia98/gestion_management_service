const express = require('express');
const router = express.Router();
const userController = require('../controllers/auth');

router.post('/register', userController.register);
router.post('/login', userController.login);

router.post('/forgetPassword', userController.forgetPassword);

module.exports = router;