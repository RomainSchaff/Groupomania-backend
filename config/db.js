const mysql = require("mysql");

const db = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : 'romaindu2612',
    database : "groupomania"
});

module.exports.getDB = () => {
     return db
}