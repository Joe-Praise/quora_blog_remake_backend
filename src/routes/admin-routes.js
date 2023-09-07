const express = require('express');
const upload = require('../config/multer');
const {
  adminLogin,
  adminLogout,
  getAdminProfile,
  createAdmin,
  getAllAdmin,
  getAdmin,
  updateAdmin,
  deleteAdmin,
  getTotalUsers,
  getTotalPosts,
  getTotalLikes,
  getTotalDislikes,
} = require('../../controller/adminController');

const router = express.Router();

router.post('/adminlogin', adminLogin);

router.post('/adminlogout', adminLogout);

router.get('/admin-profile', getAdminProfile);

// ADMIN USER

// create user
router.post('/create-admin', createAdmin);

// get Admin Users
router.get('/users', getAllAdmin);

// get particular Admin
router.get('/user/:id', getAdmin);

// update user
router.post('/update-user', upload.any(), updateAdmin);

// delete user
router.delete('/delete-user/:id', deleteAdmin);

router.get('/user-count', getTotalUsers);

router.get('/post-count', getTotalPosts);

router.get('/likes-count', getTotalLikes);

router.get('/dislikes-count', getTotalDislikes);

module.exports = router;
