const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

const { getReview, getAllReviews, createReview, deleteReview } =
  reviewController;
const { protect, restrictTo } = authController;

router.route('/:id').get(protect, getReview).delete(deleteReview);
router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), createReview);

module.exports = router;
