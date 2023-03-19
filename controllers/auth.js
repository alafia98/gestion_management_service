const mysql = require('mysql');
const db = require('../db-config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.login = (req, res) => {
    try {
        const { email, password } = req.body;
        db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            console.log(result);
            if (result.length <= 0) {
                return res.status(401).render('login', { message: 'البريد الالكتروني غير صحيح', msg_type: 'error' })
            } else {
                if (!(await bcrypt.compare(password, result[0].password))) {
                    return res.status(401).render('login', { message: 'كلمة السر غير صحيحة', msg_type: 'error' })
                } else {
                    const id = result[0].id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    console.log("The token is: " + token);
                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 24 * 60 * 60 * 1000),
                        httpOnly: true,
                    };
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect('home');
                }
            };
        })
    } catch (error) {
        console.log(error);
    }
};

exports.register = (req, res) => {
    const { full_name, email, password, confirm_password } = req.body;
    db.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
        if (error) {
            confirm.log(error)
        }
        if (result.length > 0) {
            return res.render('register', { message: 'البريد الالكتروني موجود بالفعل' })
        } else if (password !== confirm_password) {
            return res.render('register', { message: 'كلمات المرور غير متطابقة' })
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        db.query('INSERT INTO users SET ?', { full_name: full_name, email: email, password: hashedPassword }, (error, result) => {
            if (error) {
                console.log(error);
            } else {
                console.log(result);
                return res.redirect('login');
            }
        });
    })
};

exports.forgetPassword = (req, res) => {
    try {
        const {email, password, confirm_password} = req.body;
        db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            if (result.length <= 0) {
                return res.render('forgetPassword', { message: 'البريد الالكتروني غير صحيح', msg_type: 'error' })
            } else if (password !== confirm_password) {
                return res.render('forgetPassword', { message: 'كلمات المرور غير متطابقة', msg_type: 'error' })
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query('UPDATE users SET password=? WHERE email=?', [hashedPassword, email], (error, result) => {
                if (!error) {
                    db.getConnection((err, db) => {
                        if (err) throw err;
                        db.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
                            if (err) confirm.log(err);
                            else res.redirect('login');
                        })
                    });
                };
            });
        })
    } catch (error) {
        console.log(error);
    }
};