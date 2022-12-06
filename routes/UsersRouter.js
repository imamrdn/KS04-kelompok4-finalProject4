const router = require('express').Router()
const Users = require('../controllers/UsersController')
const authenticationMiddleware = require('../middlewares/AuthenticationMiddleware')

router.post('/register', Users.Register)
router.post('/login', Users.Login)
router.use(authenticationMiddleware)
router.put('/:usersId', Users.Update)
router.delete('/:usersId', Users.Delete)

module.exports = router