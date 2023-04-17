const mongoose = require('mongoose');
const slugify = require('slugify');

// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: [true, 'This tour name is already taken'],
      trim: true,
      // validate: validator.isAlpha, s
    },
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration'],
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a maximum group size'],
    },
    summary: {
      type: String,
      trim: true, // removes whitespace at the beginning and end of the string
      required: [true, 'A tour must have a summary'],
    },
    description: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description'],
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5, 'Rating must be less than or equal to 5'],
      min: [1, 'Rating must be greater than or equal to 1'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price'],
    },
    priceDiscount: {
      type: Number,
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message:
          '{VALUE} is not a valid difficulty. Please choose from: easy, medium, or difficult',
      },
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have an image cover'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now,
    },
    startDates: [Date],
    slug: String,
    secretTour: {
      type: Boolean,
      default: false,
    },
    startLocation: {
      // Geospacial Data: GeoJSON
      type: {
        type: String,
        default: 'Point',
        enum: ['Point'],
      },
      coordinates: [Number],
      address: String,
      description: String,
    },
    // putting this in an array makes each location a sub-document with its own ID.
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point'],
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number,
      },
    ],
    guides: [{ type: mongoose.Schema.ObjectId, ref: 'User' }],
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// document middleware

tourSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// embedding data model
// get users from their ID's
// NOTES
// tourSchema.pre('save', async function (next) {
//   const guidesPromises = this.guides.map(async (id) => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.post('save', (doc, next) => {
//   console.log(doc);
//   next();
// });

// query middleware

tourSchema.pre(/^find/, function (next) {
  // we could use just 'find'. However this would not work with findById or findOne
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.post(/^find/, function (docs, next) {
  // eslint-disable-next-line no-console
  console.log(`[Post-Query] Query took ${Date.now() - this.start}ms`);
  next();
});

tourSchema.pre(/^find/, (next) => {
  this.populate({
    path: 'guides',
    select: '-__v passwordChangedAt',
  });
});

// aggregate middleware

tourSchema.pre('aggregate', function (next) {
  // this.pipeline refers to the pipeline of stages defined in the aggregation
  // unshift() adds a new stage to the beginning of the pipeline
  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
