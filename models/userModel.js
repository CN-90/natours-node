const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
// const slugify = require('slugify');

const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A user must have a name']
  },
  email: {
    type: String,
    required: [true, 'An email is required'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please enter a valid email.']
  },
  photo: String,
  password: {
    type: String,
    required: [true, 'A password is required'],
    minLength: [8, 'Password must be 8 characters or more.']
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: {
      // THIS only works on CREATE AND SAVE and NOT UPDATE!!!
      validator: function(el) {
        return el === this.password;
      },
      message: 'Passwords do not match.'
    }
  }
});

// Encrypt password before it is saved.
usersSchema.pre('save', async function(next) {
  // Only run this function is the password was modified.
  if (!this.isModified('password')) return next();

  // hash password with salt cost of 12
  this.password = await bcrypt.hash(this.password, 12);
  // remove password confirm field.
  this.passwordConfirm = undefined;
  next();
});

const User = mongoose.model('User', usersSchema);
module.exports = User;
