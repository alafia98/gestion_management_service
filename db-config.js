const mysql = require('mysql');
require('dotenv').config();
/*
const db = mysql.createConnection({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE
});
*/

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
})

/*
db.connect((error) => {
    if(error) {
        console.log('Error in MySQL Connetion' + JSON.stringify(err, undefined, 2));
    } else {
        console.log('MySQL Connected Successfully');
    }
});
*/
module.exports = pool;