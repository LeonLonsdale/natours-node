const express = require('express');

const userController = require('../controllers/userController');

const authController = require('../controllers/authController');

const { getAllUsers, getUser, updateUser, deleteUser } = userController;

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
} = authController;

const router = express.Router();

router.post('/signup', signup);
router.post('/login', login);

router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);
router.patch('/update-my-password', protect, updatePassword);

router.route('/').get(getAllUsers);
// .post(createUser);

router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;