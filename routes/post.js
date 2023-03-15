const express = require("express");
const router = express.Router();
const postCtrl = require("../controllers/post");
const auth = require("../middlewares/auth");
const multer = require("../middlewares/multer-config");

router.get("/", auth, postCtrl.getAllPosts);
router.get("/:id", auth, postCtrl.getUserPosts);
router.post("/", auth, multer.single("post_image"), postCtrl.createPost);
router.delete("/:id", auth, postCtrl.deleteOnePost);
router.put("/:id", auth, postCtrl.updatePost);

router.get("/image/:id", auth, postCtrl.getPostImage);

router.post("/likeUnlike", auth, postCtrl.likeUnlikePost);
router.post("/postLiked", auth, postCtrl.postLiked);
router.get("/countLikes/:id", auth, postCtrl.countLikes);

module.exports = router;
