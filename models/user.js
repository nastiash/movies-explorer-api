const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const {
  emailInvalidErrorMessage,
  credentialsErrorMessage,
  passwordErrorMessage,
  requiredErrorMessage,
} = require('../utils/constants');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, requiredErrorMessage],
    unique: true,
    validate: {
      validator: (v) => validator.isEmail(v),
      message: emailInvalidErrorMessage,
    },
  },
  password: {
    type: String,
    required: [true, requiredErrorMessage],
    select: false,
    minlength: 8,
    validate: {
      validator: (v) => validator.isStrongPassword(v),
      message: passwordErrorMessage,
    },
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    required: [true, requiredErrorMessage],
  },
});

userSchema.statics.findUserByCredentials = function findUser(email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(credentialsErrorMessage));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(credentialsErrorMessage));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
