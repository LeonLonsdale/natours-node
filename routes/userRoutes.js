const express = require('express');

const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

const {
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
  updateMe,
  deleteMe,
  getMe,
} = userController;

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = authController;

const router = express.Router();

router.get('/me', protect, getMe, getUser);

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-my-password', protect, updatePassword);

router.patch('/update-me', protect, updateMe);
router.delete('/delete-me', protect, deleteMe);

router.route('/').get(protect, getAllUsers);
// .post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
