const mysql = require('mysql');
require('dotenv').config();

const pool = mysql.createPool({
    connectionLimit: 100,
    host            : process.env.DATABASE_HOST,
    user            : process.env.DATABASE_USER,
    password        : process.env.DATABASE_PASSWORD,
    database        : process.env.DATABASE
});

pool.getConnection((err, connection) => {
    if(err) throw err;
    else console.log('Connected as ID ' + connection.threadId);
});

module.exports = pool;