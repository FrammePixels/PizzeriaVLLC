const express = require("express");
const { verificarToken } = require("../middleware/authMiddleware");
const { upload } = require("../utils/uploadConfig");
const postController = require("../controllers/postController");

const router = express.Router();

router.get("/", postController.getPosts);
router.get("/:id", postController.getPostById);
router.post("/", verificarToken, upload.single("imagen"), postController.createPost);
router.delete("/:id", verificarToken, postController.deletePost);

module.exports = router;