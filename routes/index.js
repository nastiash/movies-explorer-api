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

const {
  notFoundErrorMessage,
} = require('../utils/constants');

router.use('/*', () => {
  throw new NotFoundError(notFoundErrorMessage);
});

module.exports = router;
