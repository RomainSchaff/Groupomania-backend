const dbc = require("../config/db");
const db = dbc.getDB();

exports.getAllComments = (req, res) => {
  const post_id = req.params.id;
  const sql = `SELECT * FROM comments, users WHERE comments.post_id = ${post_id} AND comments.user_id = users.user_id ORDER BY date_creation ASC;`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    for (i = 0; i < result.length; i++) {
      delete result[i].user_password;
      delete result[i].user_bio;
    }
    res.status(200).json(result);
  });
};

exports.getOneComment = (req, res) => {
  const comment_id = req.params.id;
  const sql = `SELECT * FROM comments WHERE comments.comment_id = ${comment_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.createComment = (req, res) => {
  const { body } = req;
  const { user_id, post_id, comment, date_creation } = body;
  const sqlComment =
    "INSERT INTO comments (user_id, post_id, comment, date_creation) VALUES ($1, $2, $3, $4) RETURNING comment_id";
  db.query(
    sqlComment,
    [user_id, post_id, comment, date_creation],
    (err, result) => {
      if (err) {
        res.status(404).json({ err });
        throw err;
      } else {
        res.status(200).json(result);
      }
    }
  );
};

exports.deleteOneComment = (req, res) => {
  const comment_id = req.params.id;
  const sql = `DELETE FROM comments WHERE comments.comment_id = ${comment_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};
