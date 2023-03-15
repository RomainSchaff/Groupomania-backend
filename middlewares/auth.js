const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, "MON_TOKEN_SECRET");
    const user_id = decodedToken.userId;
    if (req.body.user_id && req.body.user_id !== user_id) {
      throw "Invalid USER_ID";
    } else {
      next();
    }
  } catch {
    res.status(401).json({ error: "Invalid request" });
  }
};
