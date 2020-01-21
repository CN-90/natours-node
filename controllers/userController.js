const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
// const APIFeatures = require('../utils/apiFeatures');
// const AppError = require('../utils/appError');

// get all users in database
exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    results: users.length,
    data: {
      users
    }
  });
});

// get a single user depending on id
exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined.'
  });
};

// creates a new user and saves to database.
exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined.'
  });
};

// updates an existing user.
exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined.'
  });
};

// deletes user depending on ID
exports.deleteUser = (req, res) => {
  res.status(500).json({
    status: 'Error',
    message: 'This route is not defined.'
  });
};
