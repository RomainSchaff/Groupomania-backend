const dbc = require("../config/db");
const db = dbc.getDB();

exports.getAllPosts = (req, res, next) => {
  const sql =
    "SELECT * FROM posts, users WHERE posts.user_id = users.user_id ORDER BY date_creation DESC;";
  db.query(sql, (err, result) => {
    if (err) {
      return res.status(404).json({ err });
    }
    for (i = 0; i < result.length; i++) {
      delete result[i].user_password;
      delete result[i].user_bio;
    }
    return res.status(200).json(result);
  });
};

exports.getUserPosts = (req, res, next) => {
  const { id: user_id } = req.params;
  const sqlGetOnePost = `SELECT users.user_id, users.user_lastname, users.user_firstname, users.user_id, posts.post_id, posts.date_creation, posts.message FROM posts, users WHERE posts.user_id = ${user_id} AND users.user_id = ${user_id} ORDER BY date_creation DESC;`;
  db.query(sqlGetOnePost, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.createPost = (req, res, next) => {
  let { body, file } = req;
  if (!file) delete req.body.image_url;

  body = {
    ...body,
  };

  const sqlInsert = "INSERT INTO posts SET ?";
  db.query(sqlInsert, body, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    const post_id = result.insertId;
    if (file) {
      const sqlInsertImage = `INSERT INTO images (image_url, post_id) VALUES ("${file.filename}", ${post_id})`;
      db.query(sqlInsertImage, (err, result) => {
        if (err) {
          res.status(404).json({ err });
          throw err;
        }
        res.status(200).json(result);
      });
    } else {
      res.status(200).json(result);
    }
  });
};

exports.deleteOnePost = (req, res, next) => {
  const { id: post_id } = req.params;
  const sql = `DELETE FROM posts WHERE posts.post_id = ${post_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.updatePost = (req, res, next) => {
  const { id: post_id } = req.params;
  const { message: updateMessage } = req.body;
  const sqlUpdatePost = `UPDATE posts SET posts.message = "${updateMessage}" WHERE posts.post_id = ${post_id};`;

  db.query(sqlUpdatePost, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.likeUnlikePost = (req, res) => {
  const { user_id, post_id } = req.body;
  const sqlSelect = `SELECT * FROM likes WHERE likes.user_id = ${user_id} AND likes.post_id = ${post_id}`;
  db.query(sqlSelect, (err, result) => {
    if (err) {
      console.log(err);
      res.status(404).json({ err });
      throw err;
    }

    if (result.length === 0) {
      const sqlInsert = `INSERT INTO likes (user_id, post_id) VALUES (${user_id}, ${post_id})`;
      db.query(sqlInsert, (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json({ err });
          throw err;
        }
        res.status(200).json(result);
      });
    } else {
      const sqlDelete = `DELETE FROM likes WHERE likes.user_id = ${user_id} AND likes.post_id = ${post_id}`;
      db.query(sqlDelete, (err, result) => {
        if (err) {
          console.log(err);
          res.status(404).json(err);
          throw err;
        }
        res.status(200).json(result);
      });
    }
  });
};

exports.countLikes = (req, res) => {
  const { id: post_id } = req.params;
  const sqlInsert = `SELECT COUNT(*) AS total FROM likes WHERE likes.post_id = ${post_id}`;
  db.query(sqlInsert, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.postLiked = (req, res) => {
  const { user_id, post_id } = req.body;
  const sql = `SELECT post_id, user_id FROM likes WHERE user_id = ${user_id} AND post_id = ${post_id}`;
  db.query(sql, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    res.status(200).json(result);
  });
};

exports.getPostImage = (req, res, next) => {
  const { id: post_id } = req.params;
  const sqlGetImage = `SELECT image_url FROM images WHERE images.post_id = ${post_id};`;
  db.query(sqlGetImage, (err, result) => {
    if (err) {
      res.status(404).json({ err });
      throw err;
    }
    if (result[0]) {
      result[0].image_url =
        req.protocol +
        "://" +
        req.get("host") +
        "/images/posts/" +
        result[0].image_url;
    }
    res.status(200).json(result);
  });
};
