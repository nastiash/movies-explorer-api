const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const {
  getCurrentUser, updateProfile,
} = require('../controllers/users');

// GET /users/me — возвращает информацию текущего пользователя
router.get('/me', getCurrentUser);

// PATCH /users/me — обновляет профиль
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}),
updateProfile);

module.exports = router;
