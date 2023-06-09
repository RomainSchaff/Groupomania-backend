const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dbc = require("../config/db");

exports.signup = async (req, res) => {
  try {
    const { user_password: password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const encryptedPassword = await bcrypt.hash(password, salt);
    const user = {
      ...req.body,
      user_password: encryptedPassword,
    };
    const sql =
      "INSERT INTO users (user_firstname, user_lastname, user_email, user_password, date) VALUES ($1, $2, $3, $4, $5) RETURNING user_id";
    const values = [
      user.user_firstname,
      user.user_lastname,
      user.user_email,
      user.user_password,
      user.date,
    ];
    const db = dbc.getDB();
    db.query(sql, values, (err, result) => {
      if (!result) {
        res.status(200).json({ message: "Email déjà enregistré", err });
      } else {
        res.status(201).json({ message: "Utilisateur créé !" });
      }
    });
  } catch (err) {
    res.status(200).json({ message: "Failed registration", err });
  }
};

exports.login = (req, res) => {
  //vérification si le user existe
  const { user_email, user_password: clearPassword } = req.body;
  const sql = `SELECT user_firstname, user_lastname, user_password, user_id, user_active, user_email, user_bio FROM users WHERE user_email=$1`;
  const db = dbc.getDB();
  db.query(sql, [user_email], async (err, results) => {
    if (err) {
      return res.status(404).json({ err });
    }
    // Vérification du hash de password dans la DB
    if (results.rows[0] && results.rows[0].user_active === 1) {
      try {
        const { user_password: hashedPassword, user_id } = results.rows[0];
        const match = await bcrypt.compare(clearPassword, hashedPassword);
        if (match) {
          // Si ça correspond on génère le jsonwebtoken
          const token = jwt.sign({ user_id }, "MON_TOKEN_SECRET", {
            expiresIn: "1 days",
          });

          delete results.rows[0].user_password;

          res.status(200).json({
            user: results.rows[0],
            token: jwt.sign({ userId: user_id }, "MON_TOKEN_SECRET", {
              expiresIn: "24h",
            }),
          });
        } else if (!match) {
          res.status(200).json({
            error: true,
            message: "Mauvais mot de passe",
          });
        }
      } catch (err) {
        console.log(err);
        return res.status(400).json({ err });
      }
    } else if (results.rows[0] && results.rows[0].user_active === 0) {
      res.status(200).json({
        error: true,
        message: "Votre compte a été désactivé",
      });
    } else if (!results.rows[0]) {
      res.status(200).json({
        error: true,
        message: "Email inconnu",
      });
    }
  });
};

exports.desactivateAccount = (req, res) => {
  const user_id = req.params.id;
  const sql = `UPDATE users SET user_active = 0 WHERE user_id = ${user_id}`;
  const db = dbc.getDB();
  db.query(sql, (err, results) => {
    console.log(results);
    if (err) {
      return res.status(404).json({ err });
    }
    res.status(200).json("ACCOUNT DESACTIVATED");
  });
};
