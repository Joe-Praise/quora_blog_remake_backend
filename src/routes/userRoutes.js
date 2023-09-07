const express = require("express");
const router = express.Router();
const {
  createUser,
  getAllUsers,
  getUser,
  getRandomProfile,
  updateUser,
  deleteUser,
} = require("../../controller/userController");

const upload = require("./../config/multer");

// USER
// create user
router.post("/create-user", createUser);

// get users
router.get("/users", getAllUsers);

// get user
router.get("/user/:id", getUser);

// get random profile
router.get("/random-profile/:id", getRandomProfile);

// update user
router.post("/update-user", upload.any(), updateUser);

// delete user
router.delete("/delete-user/:id", deleteUser);

module.exports = router;
