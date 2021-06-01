const Movie = require('../models/movie');

/*
400 — переданы некорректные данные
403 — не хватает прав
404 — фильм или пользователь не найден
500 — ошибка по-умолчанию
*/

const IncorrectDataError = require('../errors/IncorrectDataError');
const NoAccessError = require('../errors/NoAccessError');
const NotFoundError = require('../errors/NotFoundError');

const {
  incorrectDataErrorMessage,
  noAccessErrorMessage,
  notFoundErrorMessage,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.status(200).send(movies);
    })
    .catch((err) => {
      throw new NotFoundError(err.message);
    })
    .catch(next);
};

const createMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailer, thumbnail,
    movieId, nameRU, nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailer,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => res.status(200).send(movie))
    .catch((err) => {
      if ((err.name === 'CastError') || (err.name === 'ValidationError')) {
        throw new IncorrectDataError(`${incorrectDataErrorMessage} : ${err.message}`);
      }
      next(err);
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(notFoundErrorMessage);
      }
      if (movie.owner.toString() !== owner) {
        throw new NoAccessError(noAccessErrorMessage);
      } else {
        Movie.findByIdAndDelete(req.params.movieId)
          .then(() => {
            res.status(200).send(movie);
          })
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
