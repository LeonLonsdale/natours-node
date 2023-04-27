const express = require('express');
const {
  getOverview,
  getTour,
  getLoginForm,
} = require('../controllers/viewController');
const { isLoggedIn } = require('../controllers/authController');

const router = express.Router();

router.use(isLoggedIn);

router.get('/', getOverview);
router.get('/login', getLoginForm);
router.get('/tour/:slug', getTour);

module.exports = router;
