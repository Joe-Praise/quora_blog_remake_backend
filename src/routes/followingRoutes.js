const express = require("express");
const router = express.Router();
const {
  createFollowing,
  getFollowing,
  getFollowers,
} = require("./../../controller/followingController");
router.post("/follow/profile/:id", createFollowing);

router.get("/following/:id", getFollowing);

router.get("/followers/:id", getFollowers);

module.exports = router;
