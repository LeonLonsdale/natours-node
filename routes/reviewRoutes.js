const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

const {
  getReview,
  getAllReviews,
  createReview,
  deleteReview,
  updateReview,
  setTourUserIds,
} = reviewController;
const { protect, restrictTo } = authController;

router
  .route('/:id')
  .get(protect, getReview)
  .delete(deleteReview)
  .patch(updateReview);
router
  .route('/')
  .get(protect, getAllReviews)
  .post(protect, restrictTo('user'), setTourUserIds, createReview);

module.exports = router;
