const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/user');

/*
400 — переданы некорректные данные
401 — ошибка авторизации
404 — карточка или пользователь не найден
409 — пользователь уже существует
500 — ошибка по-умолчанию
*/

const IncorrectDataError = require('../errors/IncorrectDataError');
const NotFoundError = require('../errors/NotFoundError');
const AuthError = require('../errors/AuthError');
const RegisterError = require('../errors/RegisterError');

const { NODE_ENV, JWT_SECRET } = process.env;

const createUser = (req, res, next) => {
  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name: req.body.name,
      email: req.body.email,
      password: hash,
    }))
    .then((user) => {
      res.status(200).send({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    })
    .catch((err) => {
      if (err.name === 'MongoError' && err.code === 11000) {
        throw new RegisterError('Пользователь с таким email уже существует.');
      }
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError(`Переданы некорректные данные ${err}.`);
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
      throw new AuthError('Введен неверный email или пароль.');
    })
    .catch(next);
};

const updateProfile = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true })
    .then((user) => {
      if (!user) {
        throw new NotFoundError('Пользователь с указанным id не найден.');
      }
      res.status(200).send(user);
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError('Переданы некорректные данные.');
      }
      next(err);
    })
    .catch(next);
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  User.findById(userId)
    .then((user) => {
      res.status(200).send(user);
    })
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError('Переданы некорректные данные.');
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
