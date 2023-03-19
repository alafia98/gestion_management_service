const db = require('../db-config');

exports.view = (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
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
        
        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('needs', { rows });
        });
    })
};

/*
exports.editLoad = async(req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        const id = req.params.id;
        connection.query('SELECT * FROM users WHERE id=?', [id], async (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('settings', { rows });
        });
    })
};

exports.updateProfile = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { full_name, email, password } = req.body;
        let id = req.params.id;
        connection.query('UPDATE users SET full_name=?, email=?, password=? WHERE id=?', [full_name, email, password, id], (err, rows) => {
            connection.release();
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;

                    let id = req.params.id;
                    connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('settings', {rows, message: 'تم التعديل' });
                    })
                });
            };
        });
    });
};
*/