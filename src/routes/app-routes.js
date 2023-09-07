const express = require("express");
const router = express.Router();
const {
  login,
  logout,
  getProfile,
} = require("./../../controller/appController");

router.post("/login", login);

router.post("/logout", logout);

router.get("/profile", getProfile);

module.exports = router;
