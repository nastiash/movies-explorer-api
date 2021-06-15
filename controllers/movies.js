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
const ConflictError = require('../errors/ConflictError');

const {
  incorrectDataErrorMessage,
  noAccessErrorMessage,
  movieNotFoundErrorMessage,
  movieConflictErrorMessage,
  validationErrorName,
  castErrorName,
  mongoErrorName,
} = require('../utils/constants');

const getMovies = (req, res, next) => {
  const owner = req.user._id;

  Movie.find({ owner })
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      if ((err.name === castErrorName) || (err.name === validationErrorName)) {
        throw new IncorrectDataError(incorrectDataErrorMessage);
      }
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
    .then((movie) => res.send(movie))
    .catch((err) => {
      if ((err.name === castErrorName) || (err.name === validationErrorName)) {
        throw new IncorrectDataError(incorrectDataErrorMessage);
      } else if (err.name === mongoErrorName && err.code === 11000) {
        throw new ConflictError(movieConflictErrorMessage);
      }
    })
    .catch(next);
};

const deleteMovie = (req, res, next) => {
  const owner = req.user._id;

  Movie.findById(req.params.movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieNotFoundErrorMessage);
      }
      if (movie.owner.toString() !== owner) {
        throw new NoAccessError(noAccessErrorMessage);
      } else {
        Movie.findByIdAndDelete(req.params.movieId)
          .then(() => {
            res.send(movie);
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
