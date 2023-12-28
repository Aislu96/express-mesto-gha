const router = require('express').Router();

const { Joi, celebrate } = require('celebrate');
const {
  getUsers, getUserId, patchMe, patchMeAvatar, getMe,
} = require('../controllers/users');
const { pattern } = require('../utils/pattern');

router.get('/', getUsers);
router.get('/me', getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchMe);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(pattern).required(),
  }),
}), patchMeAvatar);

module.exports = router;
