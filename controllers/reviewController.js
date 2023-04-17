const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// const APIFeatures = require('../utils/apifeatures');

exports.getReview = catchAsync(async (req, res, next) => {
  // find the tour
  const review = await Review.findById(req.params.id).populate('tour');

  // check the tour exists

  if (!review) return next(new AppError('No review found', 404));

  // return the tour
  res.status(200).json({
    status: 'success',
    data: {
      review,
    },
  });
});

exports.getAllReviews = catchAsync(async (req, res, next) => {
  // get all reviews
  const reviews = await Review.find();

  // return all reviews
  res.status(200).json({
    status: 'success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  // nested routes tours/:tourId/reviews
  if (!req.body.tour) req.body.tour = req.params.tourId; // reference tour id in review (parent referencing)
  if (!req.body.user) req.body.user = req.user.id; // reference user id in review (parent referencing)
  const review = await Review.create(req.body);

  res.status(201).json({
    status: 'success',
    data: {
      review,
    },
  });
});