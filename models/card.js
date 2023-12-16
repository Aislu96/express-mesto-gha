const mongoose = require('mongoose');
const isUrl = require('validator/lib/isURL');

const cardSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Поле "name" должно быть заполнено'],
      minlength: [2, 'Минимальная длина поля "name" - 2'],
      maxlength: [30, 'Максимальная длина поля "name" - 30'],
    },
    link: {
      type: String,
      required: [true, 'Поле "link" должно быть заполнено'],
      validate: {
        validator: (v) => isUrl(v),
        message: 'Некорректный URL',
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Поле "owner" должно быть заполнено'],
    },
    likes: [{
      type: mongoose.Schema.Types.ObjectId,
      default: [],
      required: [true, 'Поле "likes" должно быть заполнено'],
    }],
    createdAt: {
      type: Date,
      default: Date.now,
      required: [true, 'Поле "createdAt" должно быть заполнено'],
    },
  },
  { versionKey: false },
);

module.exports = mongoose.model('card', cardSchema);
