const crypto = require('crypto');
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
  photo: {
    type: String,
    default: 'default.jpg'
  },
  role: {
    type: String,
    enum: ['user', 'guide', 'lead-guide', 'admin'],
    default: 'user'
  },
  password: {
    type: String,
    required: [true, 'A password is required'],
    minLength: [8, 'Password must be 8 characters or more.'],
    select: false // select ensures the field is not returned when making a query unless specified with .select('+password')
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
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false
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

usersSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  // ensures token is always created after password has been changed.
  this.passwordChangedAt = Date.now() - 1000;
  next();
});

// only returns users where active is not equal ($ne) to false.
usersSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

usersSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

usersSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimeStamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimeStamp;
  }

  // means not changed.
  return false;
};

usersSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  console.log({ resetToken }, this.passwordResetToken);

  // token expires in ten minutes.
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', usersSchema);

module.exports = User;
