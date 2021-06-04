const express = require('express');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const helmet = require('helmet');
const mongoose = require('mongoose');

const { errors } = require('celebrate');

const errorHandler = require('./middlewares/errors');

const router = require('./routes/index');

const limiter = require('./middlewares/rateLimit');

const app = express();

const { PORT = 3000, DB_HOST = 'mongodb://localhost:27017/bitfilmsdb' } = process.env;

const { requestLogger, errorLogger } = require('./middlewares/logger');

mongoose.connect(`${DB_HOST}`, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useFindAndModify: false,
  useUnifiedTopology: true,
});

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(limiter);

app.use(helmet());

app.use('/', router);

app.use(errorLogger);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
