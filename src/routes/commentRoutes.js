const express = require("express");
const router = express.Router();
const {
  createComment,
  getComment,
  deleteComment,
} = require("../../controller/commentController");

// COMMENT
// create comment
// add authorId through the form
router.post("/posts/:id/comment", createComment);

// get comments for a particular post
router.get("/post/:id/comments", getComment);

// delete comment for a particular post
router.delete("/delete-comment/:id", deleteComment);

module.exports = router;
