const db = require('../db-config');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.loadLogin = async (req, res) => {
    try {
        res.render('login');
    }
    catch(error) {
        console.log(error.message);
    }
};
exports.verifyLogin = async (req, res) => {
    try {
        const { email, password } = req.body;
        db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            if (result.length <= 0) {
                return res.status(401).render('login', { message: 'Email incorrect', msg_type: 'error' })
            } else {
                if (!(await bcrypt.compare(password, result[0].password))) {
                    return res.status(401).render('login', { message: 'Mot de passe incorrect', msg_type: 'error' })
                } else {
                    req.session.user_id = result[0].id;
                    const id = req.body.id;
                    const token = jwt.sign({ id: id }, process.env.JWT_SECRET, {
                        expiresIn: process.env.JWT_EXPIRES_IN
                    });
                    const cookieOptions = {
                        expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES * 60 * 60 * 1000),
                        httpOnly: true,
                    };
                    res.cookie('jwt', token, cookieOptions);
                    res.status(200).redirect('home');
                }
            };
        })
    } catch (error) {
        console.log(error.message);
    }
};

exports.loadRegister = async (req, res) => {
    try {
        res.render('register');
    } catch (error) {
        console.log(error.message);
    }
};
exports.verifyRegister = async (req, res) => {
    const { full_name, email, password, confirm_password } = req.body;
    db.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
        if (error) {
            confirm.log(error)
        }
        if (result.length > 0) {
            return res.render('register', { message: 'Email existe déjà' })
        } else if (password !== confirm_password) {
            return res.render('register', { message: 'Les mots de passe sont différents' })
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

exports.loadForgetPassword = async (req, res) => {
    try {
        res.render('forgetPassword')
    } catch (error) {
        console.log(error.message);
    }
};
exports.verifyForgetPassword = async (req, res) => {
    try {
        const {email, password, confirm_password} = req.body;
        db.query('SELECT * FROM users WHERE email=?', [email], async (error, result) => {
            if (result.length <= 0) {
                return res.render('forgetPassword', { message: 'Email incorrect', msg_type: 'error' })
            } else if (password !== confirm_password) {
                return res.render('forgetPassword', { message: 'Les mots de passe sont différents', msg_type: 'error' })
            }
            let hashedPassword = await bcrypt.hash(password, 8);
            db.query('UPDATE users SET password=? WHERE email=?', [hashedPassword, email], (error, result) => {
                if (!error) {
                    db.getConnection((err, connection) => {
                        if (err) throw err;
                        connection.query('SELECT * FROM users WHERE email=?', [email], (err, result) => {
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

exports.logout = async (req, res) =>  {
    try {
        req.session.destroy();
        res.redirect('/');
    } catch (error) {
        console.log(error.message);
    }
};


exports.loadDashboard = async (req, res) => {
    try {
        db.getConnection((err, connection) => {
            if (err) throw err;
            else console.log('Connected as ID' + connection.threadId);
    
            connection.query('SELECT * FROM data ORDER BY created_at DESC', (err, rows) => {
                connection.release();
                if(err) confirm.log(err);
                else res.render('home', { rows, session: req.session });
            });
        })
    } catch (error) {
        console.log(error.message);
    }
};
exports.loadDashboardAr = async (req, res) => {
    try {
        db.getConnection((err, connection) => {
            if (err) throw err;
            else console.log('Connected as ID' + connection.threadId);
    
            connection.query('SELECT * FROM data ORDER BY created_at DESC', (err, rows) => {
                connection.release();
                if(err) confirm.log(err);
                else res.render('homeAr', { rows, session: req.session });
            });
        })
    } catch (error) {
        console.log(error.message);
    }
};

exports.loadAdd = async (req, res) => {
    try {
        res.render('addService');
    } catch (error) {
        console.log(error.message);
    }
};
exports.addService = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { service, user, materiel, desc_materiel, address_ip, needs } = req.body;
        connection.query('INSERT INTO data (service, user, materiel, desc_materiel, address_ip, needs) values (?,?,?,?,?,?)', [service, user, materiel, desc_materiel, address_ip, needs], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('addService', { message: 'Ajouté avec succès' });
        });
    });
};
exports.loadAddAr = async (req, res) => {
    try {
        res.render('addServiceAr');
    } catch (error) {
        console.log(error.message);
    }
};
exports.addServiceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { service, user, materiel, desc_materiel, address_ip, needs } = req.body;
        connection.query('INSERT INTO data (service, user, materiel, desc_materiel, address_ip, needs) values (?,?,?,?,?,?)', [service, user, materiel, desc_materiel, address_ip, needs], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('addServiceAr', { message: 'تمت الإضافة' });
        });
    });
};

exports.editService = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('editService', { rows });
        });
    });
};
exports.updateService = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { service, user, materiel, desc_materiel, address_ip, needs } = req.body;
        let id = req.params.id;
        connection.query('UPDATE data SET service=?, user=?, materiel=?, desc_materiel=?, address_ip=?, needs=? WHERE id=?', [service, user, materiel, desc_materiel, address_ip, needs, id], (err, rows) => {
            connection.release();
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('editService', {rows, message: 'Modifié avec succès' });
                    })
                });
            };
        });
    });
};
exports.editServiceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('editServiceAr', { rows });
        });
    });
};
exports.updateServiceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { service, user, materiel, desc_materiel, address_ip, needs } = req.body;
        let id = req.params.id;
        connection.query('UPDATE data SET service=?, user=?, materiel=?, desc_materiel=?, address_ip=?, needs=? WHERE id=?', [service, user, materiel, desc_materiel, address_ip, needs, id], (err, rows) => {
            connection.release();
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM data WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('editServiceAr', {rows, message: 'تم التعديل' });
                    })
                });
            };
        });
    });
};

exports.deleteService = async (req, res) => {
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
exports.deleteServiceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let id = req.params.id;
        connection.query('DELETE FROM data WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.redirect('/homeAr');
        });
    });
};

exports.service = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('service', { rows });
        });
    })
};
exports.searchService = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE service LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('service', {rows, message: searchTerm});
        });
    })
};
exports.serviceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('serviceAr', { rows });
        });
    })
};
exports.searchServiceAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE service LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('serviceAr', {rows, message: searchTerm});
        });
    })
};

exports.user = async (req, res) => {
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
exports.searchUser = async (req, res) => {
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
exports.userAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        connection.query('SELECT * FROM data', (err, rows) => {
            connection.release();
            if (!err) { res.render('userAr', { rows }); }
            else { console.log(err) };
        });
    })
};
exports.searchUserAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let searchTerm = req.body.search;
        connection.query('SELECT * FROM data WHERE user LIKE ?', ['%' + searchTerm + '%'], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('userAr', {rows, message: searchTerm});
        });
    })
};

exports.needs = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        connection.query('SELECT * FROM data WHERE needs!="" ', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('needs', {rows})
        });
    })
};
exports.needsAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);
        
        connection.query('SELECT * FROM data WHERE needs!="" ', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('needsAr', {rows})
        });
    })
};

exports.settings = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('settings', { rows, session: req.session });
        });
    })
};
exports.settingsAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID' + connection.threadId);

        connection.query('SELECT * FROM users', (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('settingsAr', { rows, session: req.session });
        });
    })
};

exports.loadAddAdmin = async (req, res) => {
    try {
        res.render('addAdmin')
    } catch (error) {
        console.log(error.message);
    }
};
exports.addAdmin = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { full_name, email, password} = req.body;
        connection.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
            if (error) {
                confirm.log(error)
            }
            if (result.length > 0) {
                return res.render('addAdmin', { message: 'Email existe déjà' })
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            connection.query('INSERT INTO users SET ?', { full_name: full_name, email: email, password: hashedPassword }, (err, rows) => {
                connection.release();
                if(err) confirm.log(err);
                else res.redirect('settings');
            });
        });
    })
};
exports.loadAddAdminAr = async (req, res) => {
    try {
        res.render('addAdminAr')
    } catch (error) {
        console.log(error.message);
    }
};
exports.addAdminAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { full_name, email, password} = req.body;
        connection.query('SELECT email FROM users WHERE email=?', [email], async (error, result) => {
            if (error) {
                confirm.log(error)
            }
            if (result.length > 0) {
                return res.render('addAdminAr', { message: 'البريد الالكتروني موجود بالفعل' })
            }

            let hashedPassword = await bcrypt.hash(password, 8);
            connection.query('INSERT INTO users SET ?', { full_name: full_name, email: email, password: hashedPassword }, (err, rows) => {
                connection.release();
                if(err) confirm.log(err);
                else res.redirect('settingsAr');
            });
        });
    })
};

exports.editAdmin = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('editAdmin', { rows });
        });
    });
};
exports.updateAdmin = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const { full_name, email, password } = req.body;
        let id = req.params.id;
        connection.query('UPDATE users SET full_name=?, email=?, password=?', [full_name, email, password], (err, rows) => {
            connection.release();
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('editAdmin', {rows, message: 'Modifié avec succès' });
                    })
                });
            };
        });
    });
};
exports.editAdminAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        const id = req.params.id;
        connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.render('editAdminAr', { rows });
        });
    });
};
exports.updateAdminAr = async (req, res) => {

        const { full_name, email, password } = req.body;

        let hashedPassword = await bcrypt.hash(password, 8);
        let id = req.params.id;
        
        db.query('UPDATE users SET full_name=?, email=?, password=? WHERE id=?', [full_name, email, hashedPassword, id], async (err, rows) => {
            if (!err) { 
                db.getConnection((err, connection) => {
                    if(err) throw err;
                    
                    let id = req.params.id;
                    connection.query('SELECT * FROM users WHERE id=?', [id], (err, rows) => {
                        connection.release();
                        if(err) confirm.log(err);
                        else res.render('editAdminAr', {rows, message: 'تم التعديل' });
                    })
                });
            };
        });
};

exports.deleteAdmin = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let id = req.params.id;
        connection.query('DELETE FROM users WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.redirect('/settings');
        });
    });
};
exports.deleteAdminAr = async (req, res) => {
    db.getConnection((err, connection) => {
        if (err) throw err;
        else console.log('Connected as ID ' + connection.threadId);

        let id = req.params.id;
        connection.query('DELETE FROM users WHERE id=?', [id], (err, rows) => {
            connection.release();
            if(err) confirm.log(err);
            else res.redirect('/settingsAr');
        });
    });
};