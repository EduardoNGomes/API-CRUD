const { Router } = require('express')
const UserController = require('../controllers/UserController')

const userController = new UserController()
const userRoutes = Router()

userRoutes.post('/', userController.create)
userRoutes.delete('/:user_id', userController.delete)
userRoutes.put('/:user_id', userController.update)

module.exports = userRoutes
