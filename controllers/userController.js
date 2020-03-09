const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

// get all users in database
exports.getAllUsers = factory.getAll(User);

// get a single user depending on id
exports.getUser = factory.getOne(User);

// updates an existing user (DO NOT UPDATE PASSWORDS WITH THIS)
exports.updateUser = factory.updateOne(User);

// deletes user depending on ID
exports.deleteUser = factory.deleteOne(User);

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) {
      newObj[el] = obj[el];
    }
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.updateMe = catchAsync(async (req, res, next) => {
  //  1) throw error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Pleaes use updatePassword',
        400
      )
    );
  }

  // filter out the body object to ensure that only name and email fields are able to be changed.
  const filteredBody = filterObj(req.body, 'name', 'email');
  // 2) Update user document (new: true -- returns new updated version of the user.)
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser
    }
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'Success',
    data: null
  });
});

// creates a new user and saves to database.
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined. Please use /Signup instead.'
  });
};
