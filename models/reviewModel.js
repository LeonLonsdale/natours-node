const mongoose = require('mongoose');

const reviewsSchema = new mongoose.Schema(
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
    toJson: { virtuals: true },
    toObject: { virtuals: true },
  }
);

const Review = mongoose.model('Review', reviewsSchema);

module.exports = Review;
