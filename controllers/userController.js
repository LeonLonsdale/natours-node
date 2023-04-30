const multer = require('multer');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const User = require('../models/userModel');
const factory = require('./handlerFactory');

const multerStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, 'public/img/users');
  },
  filename: (req, file, callback) => {
    const ext = file.mimetype.split('/')[1];
    callback(null, `user-${req.user.id}-${Date.now()}.${ext}`);
  },
});

const multerFilter = (req, file, callback) => {
  if (req.mimetype.startsWith('image')) {
    callback(null, true);
  } else {
    callback(new AppError('You can only upload images', 400), false);
  }
};

const upload = multer({
  storage: multerStorage,
  fileFilter: multerFilter,
});

exports.uploadUserPhoto = upload.single('photo');

const filterObject = (obj, fields) => {
  const output = {};
  Object.keys(obj).forEach((key) => {
    if (fields.includes(key)) {
      output[key] = obj[key];
    }
  });
  return output;
};
// middleware to set params id to user id (from protect).
// router => protect, getMe, getUser = getOne.
exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
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
  if (req.file) filteredBody.photo = req.file.filename;
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

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'Please use /signup to create a user',
  });
};

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User);
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);

// ====== [ old code ]

// exports.getAllUsers = catchAsync(async (req, res, next) => {
//   const users = await User.find();
//   res.status(200).json({
//     status: 'success',
//     results: users.length,
//     data: {
//       users,
//     },
//   });
// });
