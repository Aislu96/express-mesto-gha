const router = require('express').Router();

const { Joi, celebrate } = require('celebrate');
const {
  getUsers, getUserId, patchMe, patchMeAvatar, getMe,
} = require('../controllers/users');
const { urlPattern } = require('../utils/urlPattern');
const auth = require('../middlewares/auth');

router.get('/', auth, getUsers);
router.get('/me', auth, getMe);
router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().length(24).hex().required(),
  }),
}), auth, getUserId);
router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required(),
    about: Joi.string().min(2).max(30).required(),
  }),
}), auth, patchMe);
router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().regex(urlPattern).required(),
  }),
}), auth, patchMeAvatar);

module.exports = router;
