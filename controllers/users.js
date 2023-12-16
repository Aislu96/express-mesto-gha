const User = require('../models/user');
const NotFoundError = require('../errors/NotFoundError');
const ValidationError = require('../errors/ValidationError');
const CastError = require('../errors/CastError');

module.exports.getUsers = (req, res, next) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.getUserId = (req, res, next) => {
  const { userId } = req.params;
  User.findById(userId)
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким id не найден.'));
      }
      return res.send(user);
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.createUser = (req, res, next) => {
  const { name, about, avatar } = req.body;
  User.create({ name, about, avatar })
    .then((user) => {
      res.status(201).send({ data: user });
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при создании пользователя.'));
      }
      return next(err);
    });
};

module.exports.patchMe = (req, res, next) => {
  const userId = req.user._id;
  const { name, about } = req.body;
  User.findByIdAndUpdate(userId, { name, about }, { runValidators: true })
    .then((user) => {
      if (!user) {
        return next(new NotFoundError('Пользователь с таким id не найден.'));
      }
      return res.send({
        _id: userId, name, about, avatar: user.avatar,
      });
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        return next(new CastError('Переданы некорректные данные при обновлении профиля.'));
      } if (err.name === 'ValidationError') {
        return next(new ValidationError(err.message));
      }
      return next(err);
    });
};

module.exports.patchMeAvatar = (req, res, next) => {
  const userId = req.user._id;
  const { avatar } = req.body;
  User.findByIdAndUpdate(userId, { avatar })
    .then((user) => {
      if (user) {
        return res.send({
          _id: userId, name: user.name, about: user.about, avatar,
        });
      }
      throw new NotFoundError('Пользователь с таким id не найден.');
    })
    .catch((err) => {
      if (err.name === 'ValidationError' || err.name === 'CastError') {
        return next(new ValidationError('Переданы некорректные данные при обновлении аватара.'));
      }
      return next(err);
    });
};
