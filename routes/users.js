const usersRouter = require('express').Router();

const {
  userValidation,
  profileValidation,
} = require('../middlewares/validation');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

// GET /users/me — возвращает информацию текущего пользователя
usersRouter.get('/users/me', userValidation, getCurrentUser);

// PATCH /users/me — обновляет профиль
usersRouter.patch('/users/me', profileValidation, updateProfile);

module.exports = usersRouter;
