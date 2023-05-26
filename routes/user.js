const express = require('express')
const router = express.Router()
const user = require('../controllers/user')
const authenticate = require('../middlewares/authenticate')

const { signup, login, updatePasswrod, addUserInfo, getUserById, updateUserInfoById } = user

router.post('/signup', signup)
router.post('/login', login)

router.use(authenticate)

router.put('/password', updatePasswrod)
router.post('/', addUserInfo)
router.get('/:userId', getUserById)
router.put('/:userId', updateUserInfoById)


module.exports = router