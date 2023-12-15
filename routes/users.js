const router = require('express').Router();

const {
  getUsers, getUserId, createUser, patchMe, patchMeAvatar,
} = require('../controllers/users');

router.get('/', getUsers);
router.get('/:userId', getUserId);
router.post('/', createUser);
router.patch('/me', patchMe);
router.patch('/me/avatar', patchMeAvatar);

module.exports = router;
