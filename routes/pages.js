const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');

router.get(['/', '/login'], (req, res, next) => {
    res.render('login');
});

router.get('/logout', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register');
});


router.get('/addDepartement', (req, res, next) => {
    res.render('addDepartement');
});


router.get('/settings', (req, res, next) => {
    res.render('settings');
});

router.get('/forgotPassword', (req, res) => {
    res.render('forgotPassword')
});

module.exports = router;