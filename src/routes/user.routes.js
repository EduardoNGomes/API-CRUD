const { Router, response } = require('express')

const multer = require('multer')
const uploadConfig = require('../configs/upload')

const UserController = require('../controllers/UserController')
const UserAvatarController = require('../controllers/UserAvatarController')

const ensureAuthenticated = require('../middleware/ensureAuthenticated')

const userController = new UserController()
const userAvatarController = new UserAvatarController()

const userRoutes = Router()
const upload = multer(uploadConfig.MULTER)

userRoutes.post('/', userController.create)
userRoutes.delete('/:user_id', userController.delete)
userRoutes.put('/', ensureAuthenticated, userController.update)
userRoutes.patch(
  '/avatar',
  ensureAuthenticated,
  upload.single('avatar'),
  userAvatarController.update
)

module.exports = userRoutes
