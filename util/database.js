const mysql = require("mysql2");


// Create a connection pool

const pool = mysql.createPool({
    // host : 'localhost',
    host : '45.55.136.114',
    user : 'F2023_kroye01',
    database : 'F2023_kroye01',
    password: "GoldenJackal2023!"
});

module.exports = pool.promise();