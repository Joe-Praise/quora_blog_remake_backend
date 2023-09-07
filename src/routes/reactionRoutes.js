const express = require("express");
const router = express.Router();
const {
  createReaction,
  getLikes,
  getUnlike,
} = require("../../controller/reactionController");

// REACTION
// create reaction and delete if already existing
router.post("/post/:id/reaction", createReaction);

// get likes
router.get("/post/:id/likes", getLikes);

// get unlikes
router.get("/post/:id/unlikes", getUnlike);

module.exports = router;
