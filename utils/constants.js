const validationErrorName = 'ValidationError';
const castErrorName = 'CastError';
const mongoErrorName = 'MongoError';

const incorrectDataErrorMessage = 'Переданы некорректные данные';
const noAccessErrorMessage = 'Недостаточно прав на выполнение операции';
const registerErrorMessage = 'Пользователь с таким e-mail уже существует';
const notFoundErrorMessage = 'Запрашиваемый ресурс не найден';
const credentialsErrorMessage = 'Введен неверный e-mail или пароль';
const urlErrorMessage = 'Введен неверный URL-адрес';
const passwordErrorMessage = 'Введен недостаточно надежный пароль';
const emailConflictErrorMessage = 'Указанный e-mail уже используется';
const emailInvalidErrorMessage = 'Введен некорректный e-mail';
const movieConflictErrorMessage = 'Указанный фильм уже существует';
const movieNotFoundErrorMessage = 'Запрашиваемый фильм не найден';
const requiredErrorMessage = 'Запрашиваемый фильм не найден';

module.exports = {
  validationErrorName,
  castErrorName,
  mongoErrorName,
  incorrectDataErrorMessage,
  noAccessErrorMessage,
  notFoundErrorMessage,
  credentialsErrorMessage,
  registerErrorMessage,
  urlErrorMessage,
  movieNotFoundErrorMessage,
  movieConflictErrorMessage,
  emailConflictErrorMessage,
  emailInvalidErrorMessage,
  passwordErrorMessage,
  requiredErrorMessage,
};
