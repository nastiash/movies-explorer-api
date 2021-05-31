const router = require('express').Router();

const usersRouter = require('./users');
const moviesRouter = require('./movies');

const {
  login,
  createUser,
} = require('../controllers/users');

const auth = require('../middlewares/auth');

const {
  loginValidation,
  signUpvalidation,
} = require('../middlewares/validation');

router.post('/signin', loginValidation, login);
router.post('/signup', signUpvalidation, createUser);

router.use(auth, usersRouter);
router.use(auth, moviesRouter);

const NotFoundError = require('../errors/NotFoundError');

router.use('*', () => {
  throw new NotFoundError('Ресурс не найден');
});

module.exports = router;

/* router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}),
login); */

/* router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().min(2).max(30),
  }),
}),
createUser); */
