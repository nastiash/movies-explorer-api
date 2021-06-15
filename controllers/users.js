const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
400 — переданы некорректные данные
401 — ошибка авторизации
404 — карточка или пользователь не найден
409 — пользователь уже существует
*/

const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const ConflictError = require('../errors/ConflictError');

const {
  incorrectDataErrorMessage,
  notFoundErrorMessage,
  credentialsErrorMessage,
  registerErrorMessage,
  mongoErrorName,
  castErrorName,
  validationErrorName,
  emailConflictErrorMessage,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        throw new ConflictError(registerErrorMessage);
      }
      if ((err.name === castErrorName) || (err.name === validationErrorName)) {
        throw new IncorrectDataError(incorrectDataErrorMessage);
      }
      next(err);
    })
    .catch(next);
};

const login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign(
        { _id: user._id },
        NODE_ENV === 'production' ? JWT_SECRET : 'token-secret',
        { expiresIn: '7d' },
      );
      res.cookie('jwt', token, {
        maxAge: 3600000,
        httpOnly: true,
        sameSite: true,
      }).send({ message: `${token}` });
    })
    .catch(() => {
      throw new AuthError(credentialsErrorMessage);
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { email, name } = req.body;

  User.findByIdAndUpdate(req.user._id, { name, email }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      res.send(user);
    })
    .catch((err) => {
      if ((err.name === castErrorName) || (err.name === validationErrorName)) {
        throw new IncorrectDataError(incorrectDataErrorMessage);
      } else if (err.name === mongoErrorName && err.code === 11000) {
        throw new ConflictError(emailConflictErrorMessage);
      }
      next(err);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.send(user);
    })
    .catch((err) => {
      if ((err.name === castErrorName) || (err.name === validationErrorName)) {
        throw new IncorrectDataError(incorrectDataErrorMessage);
      }
      next(err);
    })
    .catch(next);
};

module.exports = {
  createUser,
  updateProfile,
  login,
  getCurrentUser,
};
