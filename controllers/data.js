const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const pool = mysql.createPool({
    connectionLimit: 100,
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});

exports.view = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('home', { rows });
        });
    })
};

exports.search = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE departement LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('home', { rows });
        });
    })
};

exports.addDepartement = (req, res) => {
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
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
                        if(err) confirm.log(err);
                        else res.render('editDepartement', {rows, message: 'تم التعديل' });
                    })
                });
            };
        });
    });
};

exports.deleteDepartement = (req, res) => {
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
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
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('needs', { rows });
        });
    })
};

exports.editAdmin = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('settings', { rows });
        });
    });
};

exports.updateAdmin = (req, res) => {
    pool.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const {full_name, email, password} = req.body;
        connection.query('SELECT * FROM users', async (err, rows) => {
            let id = req.params.id;
            let hashedPassword = await bcrypt.hash(password, 8);
            connection.query('UPDATE users SET full_name=?, email=?, password=? WHERE id=?', [full_name, email, hashedPassword, id], (err, rows) => {
                connection.release();
                if (!err) { 
                    pool.getConnection((err, connection) => {
                        if(err) throw err;
                        
                        let id = req.params.id;
                        connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
                            connection.release();
                            if(err) confirm.log(err);
                            else {
                                res.render('settings', {rows, message: 'تم التعديل' });
                            };
                        })
                    });
                };
            });
        })
    });
};