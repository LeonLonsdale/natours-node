const express = require('express');
const tourController = require('../controllers/tourController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');

const router = express.Router();

const {
  getAllTours,
  createTour,
  getTour,
  updateTour,
  deleteTour,
  aliasTopCheap,
  aliasTopRated,
  getTourStats,
  getMonthlyPlan,
} = tourController;

const { protect, restrictTo } = authController;

const { createReview } = reviewController;

// 'param middleware' - middleware that only runs for certain parameters.
// remember that a parameter is anything in the url additional to the route.

// this middleware will only run where there is a tour ID as it is added to the tour router.
// router.param('id', checkID);
router.route('/top-five-cheap').get(aliasTopCheap, getAllTours);
router.route('/top-five-rated').get(aliasTopRated, getAllTours);
router.route('/stats').get(getTourStats);
router.route('/monthly-plan/:year').get(getMonthlyPlan);
router.route('/').get(protect, getAllTours).post(createTour);
router
  .route('/:id')
  .get(getTour)
  .patch(updateTour)
  .delete(protect, restrictTo('admin'), deleteTour);

router
  .route('/:tourId/reviews')
  .post(protect, restrictTo('users'), createReview);

module.exports = router;
