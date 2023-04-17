const Review = require('../models/reviewModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const factory = require('./handlerFactory');
// const APIFeatures = require('../utils/apifeatures');

exports.getReview = catchAsync(async (req, res, next) => {
  // find the tour
  const review = await Review.findById(req.params.id).populate({
    path: 'tour',
    select: 'name',
  });

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
  // if a tour ID exists from a nested route, only return the specific tour
  let filter;
  if (req.params.tourId) filter = { tour: req.params.tourId };
  // get all reviews
  const reviews = await Review.find(filter);

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

exports.deleteReview = factory.deleteOne(Review);
