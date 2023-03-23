// const mysql = require("mysql");

// const db = mysql.createConnection({
//     host     : 'localhost',
//     user     : 'root',
//     password : 'romaindu2612',
//     database : "groupomania"
// });

// module.exports.getDB = () => {
//      return db
// }

const { Pool } = require("pg");

// const pool = new Pool({
//   user: "romain",
//   host: "frankfurt-postgres.render.com",
//   database: "groupomania_99fi",
//   password: "cPt841EAgk3aZCSDSeOcIFn4H6Hx3Nug",
//   port: 5432,
//   ssl: true,
// });

// const pool = new Pool({
//   username: "romain",
//   hostname: "dpg-cg99snkeooghng70jk0g-a",
//   database: "groupomania_99fi",
//   password: "cPt841EAgk3aZCSDSeOcIFn4H6Hx3Nug",
//   port: 5432,
// });

const pool = new Pool({
  connectionString:
    "postgres://romain:cPt841EAgk3aZCSDSeOcIFn4H6Hx3Nug@dpg-cg99snkeooghng70jk0g-a/groupomania_99fi",
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error("Error acquiring client", err.stack);
  }
  console.log("Connected to PostgreSQL database");
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err);
  process.exit(-1);
});

module.exports.getDB = () => {
  return pool;
};
