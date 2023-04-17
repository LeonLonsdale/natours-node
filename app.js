// [Imports] ==============================================================

const express = require('express');

const app = express();
const morgan = require('morgan');

const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorController');
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// [Middleware] ===========================================================
// eslint-disable-next-line no-console
console.log(`Starting app. Mode: ${process.env.NODE_ENV}`);
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json()); // adds data from body to request object
app.use(express.static(`${__dirname}/public`)); // public files include HTML, CSS, etc. Use this to allow access to these files from browser.

// [Routing] ==============================================================

// mount the routers
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

// catch unhandled routes
app.all('*', (req, res, next) => {
  // if an argument is passed to next, express will assume that it is an error and trigger the error middleware
  next(new AppError(`${req.originalUrl} not found`, 404));
});

// by providing 4 argments, Express will automatically know that the middleware is for error handling.
app.use(globalErrorHandler);

// [Exports] ==============================================================

module.exports = app;
