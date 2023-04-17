const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
// const APIFeatures = require('../utils/apifeatures');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

const filterObject = (obj, fields) => {
  const output = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) {
      output[key] = obj[key];
    }
  });
  return output;
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // create error if trying to update password
  if (req.body.password || req.body.passwordConfirm)
    return next(
      new AppError(
        'This route is not for password changes. Use /update-my-password',
        400
      )
    );
  // update the user document
  // filter out field names that are not allowed to be updated.
  const filteredBody = filterObject(req.body, ['name', 'email']);
  const user = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();
  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users,
    },
  });
});

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Route not yet defined',
  });
};

exports.deleteUser = factory.deleteOne(User);
