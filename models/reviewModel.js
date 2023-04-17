const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'A review must belong to a user'],
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour'],
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: [true, 'Rating is required'],
    },
    message: {
      type: String,
      required: [true, 'Review cannot be empty'],
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

reviewSchema.pre(/^find/, function (next) {
  // this.populate({
  //   path: 'tour',
  //   select: 'name',
  // });
  this.populate({
    path: 'user',
    select: 'name photo',
  });
  next();
});

// calculating number of reviews and average rating for tours.
// async because aggregate returns a promise.
reviewSchema.statics.calcAverageRatings = async function (tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }, // match reviews where the tour field matches the tourId passed in as an argument.
    },
    {
      $group: {
        _id: '$tour', // group by the tour field
        nRating: { $sum: 1 }, // add 1 for each review found
        avgRating: { $avg: '$rating' }, // average all of the rating fields
      },
    },
  ]);
  // the resolved aggretate promise is an array of objects containing our results
  // [{_id:... , nRating: x, avgRating: y}] - if we did this for all tours each tour would be an object in the array.
  // persist results to the tours collection.
  await Tour.findByIdAndUpdate(tourId, {
    ratingsQuantity: stats[0].nRating,
    ratingsAverage: stats[0].avgRating,
  });
};
// set up a post-save middleware hook that calls on the calcAverageRatings static
// post middleware does not get access to next().
reviewSchema.post('save', function () {
  // affects current review being saved
  // this.constructor gives us access to the methods added to the model through statics / instance methods.
  this.constructor.calcAverageRatings(this.tour);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
