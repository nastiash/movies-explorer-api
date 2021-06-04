const jwt = require('jsonwebtoken');

const AuthError = require('../errors/AuthError');
const IncorrectDataError = require('../errors/IncorrectDataError');

const {
  incorrectDataErrorMessage,
  credentialsErrorMessage,
} = require('../utils/constants');

const { NODE_ENV, JWT_SECRET } = process.env;

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new IncorrectDataError(incorrectDataErrorMessage);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'token-secret');
  } catch (err) {
    throw new AuthError(credentialsErrorMessage);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  next(); // пропускаем запрос дальше
};
