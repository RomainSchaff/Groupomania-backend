const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/auth");
const auth = require("../middlewares/auth");

router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.put("/desactivateAccount/:id", auth, userCtrl.desactivateAccount);

module.exports = router;
