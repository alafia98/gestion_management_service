const db = require('../db-config');
const bcrypt = require('bcryptjs')

exports.view = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM data ORDER BY created_at DESC', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('home', { rows, session: req.session });
        });
    })
};

exports.search = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let filter = req.body.filter;
        connection.query('SELECT * FROM data WHERE departement LIKE ?', [filter], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('home', { rows });
        });
    })
};

exports.addDepartement = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { departement, user, materiel, desc_materiel, address_ip, needs } = req.body;
        connection.query('INSERT INTO data (departement, user, materiel, desc_materiel, address_ip, needs) values (?,?,?,?,?,?)', [departement, user, materiel, desc_materiel, address_ip, needs], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('addDepartement', { message: 'تمت الإضافة' });
        });
    });
};

exports.editDepartement = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('editDepartement', { rows });
        });
    });
};

exports.updateDepartement = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { departement, user, materiel, desc_materiel, address_ip, needs } = req.body;
        let id = req.params.id;
        connection.query('UPDATE data SET departement=?, user=?, materiel=?, desc_materiel=?, address_ip=?, needs=? WHERE id=?', [departement, user, materiel, desc_materiel, address_ip, needs, id], (err, rows) => {
            connection.release();
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('editDepartement', {rows, message: 'تم التعديل' });
                    })
                });
            };
        });
    });
};

exports.deleteDepartement = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let id = req.params.id;
        connection.query('DELETE FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.redirect('/home');
        });
    });
};

exports.departement = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('departement', { rows });
        });
    })
};

exports.searchDep = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE departement LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('departement', {rows, message: searchTerm});
        });
    })
};

exports.user = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if (!err) { res.render('user', { rows }); }
            else { console.log(err) };
        });
    })
};

exports.searchUser = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE user LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('user', {rows, message: searchTerm});
        });
    })
};

exports.needs = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        connection.query('SELECT * FROM data ORDER BY needs DESC', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else if(rows.needs !== null || rows.needs !== '') res.render('needs', { rows });
        });
    })
};

exports.settings = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        const {full_name, email, password, confirm_password } = req.body;
        connection.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
            connection.release();

            if(error) confirm.log(error);
            else if (result.length > 0) {
                return res.render('settings', { error: 'البريد الالكتروني موجود بالفعل' })
            } else if (password !== confirm_password) {
                return res.render('settings', { error: 'كلمات المرور غير متطابقة' })
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            connection.query('INSERT INTO users SET ?', { full_name: full_name, email: email, password: hashedPassword }, (error, result) => {
                if (error) {
                    console.log(error);
                } else {
                    console.log(result);
                    return res.render('settings', { success: 'تمت الإضافة' });
                }
            });                
        });
    })
};