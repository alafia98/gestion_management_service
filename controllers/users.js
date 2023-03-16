const mysql = require('mysql');
const db = require('../db-config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
//const {promisify} = require('util');

exports.login = (req, res) => {
    try {
        const {email, password} = req.body;
        db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            console.log(result);
            if(result.length<=0) {
                return res.status(401).render('login', {message: 'البريد الالكتروني غير صحيح', msg_type: 'error'})
            } else {
                if (!(await bcrypt.compare(password, result[0].password))) {
                    return res.status(401).render('login', {message: 'كلمة السر غير صحيحة', msg_type: 'error'})
                } else {
                    const id = result[0].id;
                    const token = jwt.sign({id: id}, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN,
                    });
                    console.log("The token is: " + token);
                    const cookieOptions = {
                        expires: new Date (Date.now() + process.env.JWT_COOKIE_EXPIRES*24*60*60*1000),
                        httpOnly: true,
                    };
                    res.status(200).redirect('/home');
                }
            };
        })
    } catch (error) {
        console.log(error);
    }
};


exports.register = (req, res) => {
    const {full_name, email, password, confirm_password} = req.body;
    db.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
        if(error) {
            confirm.log(error)
        }
        if(result.length>0) {
            return res.render('register', {message: 'البريد الالكتروني موجود بالفعل'})
        } else if (password !== confirm_password) {
            return res.render('register', {message: 'كلمات المرور غير متطابقة'})
        }
        let hashedPassword = await bcrypt.hash(password, 8);
        db.query('INSERT INTO users SET ?', {full_name:full_name, email:email, password:hashedPassword}, (error, result) => {
            if(error) {
                console.log(error);
            } else {
                console.log(result);
                return res.render('login')
            }
        });
    })
};
/*
exports.isLoggedIn = async (req, res, next) => {
    if(req.cookies.joes) {
        try {
            const decode = await promisify(jwt.verify)(
                req.cookies.joes,
                process.env.JWT_SECRET
            );
            db.query('SELECT * FROM users WHERE id=?', [decode.id], (err, results) => {
                if(!results) {
                    return next();
                }
                req.user = results[0];
                return next();
            });
        } catch (error) {
            console.log(error);
            return next();
        }
    } else {
        
    }
};


exports.logout = async (req, res) => {
    res.cookie('joes', 'logout', {
        expiresIn: new Date(Date.now() + 2 * 1000),
        httpOnly: true
    });
    res.status(200).redirect('/');
};
*/