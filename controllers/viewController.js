const Tour = require('../models/tourModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

exports.getOverview = catchAsync(async (req, res, next) => {
  // get all tour data
  const tours = await Tour.find();
  // build template

  // render template
  res.status(200).render('overview', {
    title: 'All Tours',
    tours,
  });
});

exports.getTour = catchAsync(async (req, res, next) => {
  const { slug } = req.params;

  const tour = await Tour.findOne({ slug: slug }).populate({
    path: 'reviews',
    fields: 'review rating user',
  });
  console.log(tour);
  if (!tour) return next(new AppError('Tour not found', 404));

  res.status(200).render('tour', {
    title: tour.name,
    tour,
  });
});
