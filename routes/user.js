const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get("/:id", auth, userCtrl.getOneUser);
router.get("/", auth, userCtrl.getUsers);
router.get("/image/:id", auth, userCtrl.getProfilImg);
router.put("/:id", auth, multer.single("profil_image"), userCtrl.updateOneUser);

module.exports = router;
