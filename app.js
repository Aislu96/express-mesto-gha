const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const helmet = require('helmet');
const { celebrate, Joi } = require('celebrate');
const errorHandler = require('./errors/errorHandler');
const NotFoundError = require('./errors/NotFoundError');
const { login, createUser } = require('./controllers/users');
const { urlPattern } = require('./utils/urlPattern');
// Слушаем 3000 порт
require('dotenv').config();

const { PORT = 3000, DB_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());

mongoose.connect(DB_URL);

app.use((req, res, next) => {
  next();
});

app.post(
  '/signin',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required().min(8),
    }),
  }),
  login,
);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(urlPattern),
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), createUser);

// app.use(auth);
app.use('/users', require('./routes/users'));
app.use('/cards', require('./routes/cards'));

app.all('*', (req, res, next) => {
  next(new NotFoundError('Неправильный путь'));
});
app.use(errors());

app.use(errorHandler);
app.listen(PORT);
