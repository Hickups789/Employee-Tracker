const mysql = require("mysql2");

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hickups789',
    database: 'election'
  });

module.exports = db;