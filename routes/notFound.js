const notFound = require('express').Router();

const NotFoundError = require('../errors/NotFoundError');

notFound.all('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = notFound;
