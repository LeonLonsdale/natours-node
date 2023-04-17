// [Imports] ==============================================================

const express = require('express');

const app = express();
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');
const reviewRouter = require('./routes/reviewRoutes');

// [Global Middleware] ===========================================================
// eslint-disable-next-line no-console

// Set security HTTP headers
app.use(helmet());

// Development logging middleware
console.log(`Starting app. Mode: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// limit requests from same IP
const limiter = rateLimit({
  max: 100,
  windowMs: 60 * 60 * 1000,
  message: 'Too many requests from this IP, please try again in an hour',
});
app.use('/api', limiter);

// body parser
app.use(express.json({ limit: '10kb' })); // adds data from body to request object

// data sanitisation against noSQL query injection
app.use(mongoSanitize());
// data sanitisation against XSS
app.use(xss());
// prevent parameter pollution
app.use(
  hpp({
    whitelist: [
      'duration',
      'ratingsQuantity',
      'ratingsAverage',
      'price',
      'maxGroupSize',
      'difficulty',
    ],
  })
);
// serve static files
app.use(express.static(`${__dirname}/public`)); // public files include HTML, CSS, etc. Use this to allow access to these files from browser.

// [Routing] ==============================================================

// mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);

// catch unhandled routes
app.all('*', (req, res, next) => {
  // if an argument is passed to next, express will assume that it is an error and trigger the error middleware
  next(new AppError(`${req.originalUrl} not found`, 404));
});

// by providing 4 argments, Express will automatically know that the middleware is for error handling.
app.use(globalErrorHandler);

// [Exports] ==============================================================

module.exports = app;
