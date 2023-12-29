const router = require('express').Router();

const { Joi, celebrate } = require('celebrate');
const {
  getUsers, getUserId, patchMe, patchMeAvatar, getMe,
} = require('../controllers/users');
const { pattern } = require('../utils/pattern');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getMe);
router.get('/:userId', auth, celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).required(),
  }),
}), getUserId);
router.patch('/me', auth, celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), patchMe);
router.patch('/me/avatar', auth, celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(pattern).required(),
  }),
}), patchMeAvatar);

module.exports = router;
