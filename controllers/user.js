const dbc = require("../config/db");
const db = dbc.getDB();

exports.getOneUser = (req, res, next) => {
  const { id: user_id } = req.params;
  const sqlGetUser = `SELECT * FROM users WHERE users.user_id = ${user_id};`;
  db.query(sqlGetUser, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    delete result[0].user_password;
    res.status(200).json(result);
  });
};

exports.getUsers = (req, res, next) => {
  const sqlGetUsers = `SELECT user_firstname, user_lastname, user_id, date FROM users ORDER BY date DESC;`;
  db.query(sqlGetUsers, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.updateOneUser = (req, res, next) => {
  const { id: user_id } = req.params;
  if (req.file) {
    let { destination, filename } = req.file;
    const sqlCheckImage = `SELECT image_url FROM images WHERE images.user_id = ${user_id}`;
    db.query(sqlCheckImage, (err, result) => {
      if (result[0]) {
        const sqlUpdateImage = `UPDATE images SET user_id = ${user_id}, image_url = "${filename}" WHERE images.user_id = ${user_id};`;
        db.query(sqlUpdateImage, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
        });
      } else if (!result[0]) {
        const sqlInsertImage = `INSERT INTO images (image_url, user_id) VALUES ("${filename}", ${user_id})`;
        db.query(sqlInsertImage, (err, result) => {
          if (err) {
            res.status(404).json({ err });
            throw err;
          }
        });
      }
      if (err) {
        res.status(404).json({ err });
        throw err;
      }
    });
  }

  const { user_firstname, user_lastname, user_bio } = req.body;
  const sqlUpdateUser = `UPDATE users SET user_firstname = "${user_firstname}", user_lastname = "${user_lastname}", user_bio = "${user_bio}" WHERE users.user_id = ${user_id};`;
  db.query(sqlUpdateUser, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    if (result) {
      res.status(200).json(result);
      console.log(result);
    }
  });
};

exports.getProfilImg = (req, res, next) => {
  const { id: user_id } = req.params;
  const sqlGetUser = `SELECT image_url FROM images WHERE images.user_id = ${user_id}`;
  db.query(sqlGetUser, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    if (result[0]) {
      result[0].image_url =
        req.protocol +
        "://" +
        req.get("host") +
        "/images/profils/" +
        result[0].image_url;
    }
    res.status(200).json(result);
  });
};
