const express = require("express");
const router = express.Router();
const { getSpacePosts } = require("./../../controller/spacePostController");

// get Space posts
router.get("/space/:category", getSpacePosts);

module.exports = router;
