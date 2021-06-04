const mongoose = require('mongoose');
const validator = require('validator');

const {
  urlErrorMessage,
  requiredErrorMessage,
} = require('../utils/constants');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, requiredErrorMessage],
  },
  director: {
    type: String,
    required: [true, requiredErrorMessage],
  },
  duration: {
    type: Number,
    required: [true, requiredErrorMessage],
  },
  year: {
    type: String,
    required: [true, requiredErrorMessage],
  },
  description: {
    type: String,
    required: [true, requiredErrorMessage],
  },
  image: {
    type: String,
    required: [true, requiredErrorMessage],
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: urlErrorMessage,
    },
  },
  trailer: {
    type: String,
    required: [true, requiredErrorMessage],
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: urlErrorMessage,
    },
  },
  thumbnail: {
    type: String,
    required: [true, requiredErrorMessage],
    validate: {
      validator: (v) => validator.isURL(v, { protocols: ['http', 'https'], require_protocol: true }),
      message: urlErrorMessage,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: [true, requiredErrorMessage],
  },
  movieId: {
    type: Number,
    required: [true, requiredErrorMessage],
  },
  nameRU: {
    type: String,
    required: [true, requiredErrorMessage],
  },
  nameEN: {
    type: String,
    required: [true, requiredErrorMessage],
  },
});

module.exports = mongoose.model('movie', movieSchema);
