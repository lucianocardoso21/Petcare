const mysql = require('mysql/promise');

const connection = mysql.create.Pool(
    {
        host: process.env.MYSQL_HOST,
        user: process.env.MYSQL_USER,
        password: process.env.MYSQL_PASSWORD,
        database: process.env.MYSQL_DB
    }
);

module.exports = connection;