const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const mysql = require('mysql');


router.get(['/', '/login'], (req, res, next) => {
    res.render('login');
});

router.get('/logout', (req, res, next) => {
    res.render('login');
});

router.get('/register', (req, res, next) => {
    res.render('register');
});

router.get('/forgotPassword', (req, res, next) => {
    res.render('forgotPassword');
});


const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

router.get('/home', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if (!err) { res.render('home', { rows }); }
            else { console.log(err) };
        });
    })
});

router.post('/home', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE departement LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if (!err) { res.render('home', { rows }); }
            else { console.log(err) };
        });
    })
});

router.get('/addDepartement', (req, res, next) => {
    res.render('addDepartement');
});

router.post('/addDepartement', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { departement, user, materiel, desc_materiel, address_ip, needs } = req.body;
        connection.query('INSERT INTO data (departement, user, materiel, desc_materiel, address_ip, needs) values (?,?,?,?,?,?)', [departement, user, materiel, desc_materiel, address_ip, needs], (err, rows) => {
            connection.release();
            if (!err) { res.render('addDepartement', { message: 'تمت الإضافة' }); }
            else { console.log(err) };
        });
    });
});

router.get('/editDepartement/:id', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if (!err) { res.render('editDepartement', { rows }); }
            else { console.log(err) };
        });
    });
});

router.post('/editDepartement/:id', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { departement, user, materiel, desc_materiel, address_ip, needs } = req.body;
        let id = req.params.id;
        connection.query('UPDATE data SET departement=?, user=?, materiel=?, desc_materiel=?, address_ip=?, needs=? WHERE id=?', [departement, user, materiel, desc_materiel, address_ip, needs, id], (err, rows) => {
            connection.release();
            if (!err) { 
                pool.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(!err) res.render('editDepartement', {rows, message: 'تم التعديل' });
                        else console.log(err);
                    })
                });
            };
        });
    });
});

router.get('/deleteDepartement/:id', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let id = req.params.id;
        connection.query('DELETE FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if (!err) { res.redirect('/home');}
            else { console.log(err) };
        });
    });
});


router.get('/departement', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if (!err) { res.render('departement', { rows }); }
            else { console.log(err) };
        });
    })
});

router.get('/user', (req, res, next) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if (!err) { res.render('user', { rows }); }
            else { console.log(err) };
        });
    })
});

/*
router.get('/settings', (req, res, next) => {
    if(req.user) {
        res.render('settings', {user: req.user});
    } else {
        res.redirect('/login');
    }
});

*/
module.exports = router;