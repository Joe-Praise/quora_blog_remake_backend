const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  createPost,
  getAllPosts,
  getPost,
  updatePost,
  deletePost,
} = require("../../controller/postController");

//POST
// create post
router.post("/create-post", upload.any(), createPost);

// get posts
router.get("/posts", getAllPosts);

// get post
router.get("/post/:id", getPost);

// update post
router.post("/update-post", upload.any(), updatePost);

// delete post
router.delete("/delete-post/:id", deletePost);

module.exports = router;
