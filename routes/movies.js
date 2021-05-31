const moviesRouter = require('express').Router();

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

const {
  movieCreateValidation,
  movieDeleteValidation,
} = require('../middlewares/validation');

// GET /movies — возвращает все сохранённые пользователем фильмы
moviesRouter.get('/movies', getMovies);

// POST /movies — создаёт фильм с переданными в теле данными
moviesRouter.post('/movies', movieCreateValidation, createMovie);

// DELETE /movies/:movieId — удаляет сохранённый фильм по id
moviesRouter.delete('/movies/:movieId', movieDeleteValidation, deleteMovie);

module.exports = moviesRouter;
