const { celebrate, Joi, CelebrateError } = require('celebrate');
const validator = require('validator');

const {
  urlErrorMessage,
} = require('../utils/constants');

const urlValidation = (value) => {
  if (!validator.isURL(value, { protocols: ['http', 'https'], require_protocol: true })) {
    throw new CelebrateError(`${urlErrorMessage} : ${value}`);
  }
  return value;
};

const loginValidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
});

const signUpvalidation = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
});

const userValidation = celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
});

const profileValidation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
});

const movieCreateValidation = celebrate({
  body: Joi.object().keys({
    country: Joi.string().required().min(2).max(50),
    director: Joi.string().required().min(2).max(50),
    duration: Joi.number().required(),
    year: Joi.string().required().min(4).max(4),
    description: Joi.string().required().min(2).max(3000),
    image: Joi.string().required().custom(urlValidation),
    trailer: Joi.string().required().custom(urlValidation),
    thumbnail: Joi.string().required().custom(urlValidation),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required().min(2).max(100),
    nameEN: Joi.string().required().min(2).max(100),
  }),
});

const movieDeleteValidation = celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24),
  }),
});

module.exports = {
  loginValidation,
  signUpvalidation,
  userValidation,
  profileValidation,
  movieCreateValidation,
  movieDeleteValidation,
};
