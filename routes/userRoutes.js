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
  uploadUserPhoto,
} = userController;

const {
  signup,
  login,
  forgotPassword,
  resetPassword,
  updatePassword,
  protect,
  restrictTo,
  logout,
} = authController;

const upload = multer({ dest: 'public/img/users' });

const router = express.Router();

// public routes
router.post('/signup', signup);
router.post('/login', login);
router.get('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.patch('/reset-password/:token', resetPassword);

// protected routes
router.use(protect);

router.get('/me', getMe, getUser);
router.patch('/update-my-password', updatePassword);
router.patch('/update-me', uploadUserPhoto, updateMe);
router.delete('/delete-me', deleteMe);

// restricted routes
router.use(restrictTo('admin'));

router.route('/').get(getAllUsers);
router.route('/:id').get(getUser).patch(updateUser).delete(deleteUser);

module.exports = router;
