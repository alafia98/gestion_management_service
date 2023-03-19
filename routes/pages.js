const express = require('express');
const router = express.Router();

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

router.get('/forgetPassword', (req, res) => {
    res.render('forgetPassword')
});

module.exports = router;