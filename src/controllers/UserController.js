const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const { hash, compare } = require('bcryptjs')

class UserController {
  async create(request, response) {
    const { name, email, password } = request.body

    const userExists = await knex
      .select('email')
      .from('users')
      .where('email', email)

    if (userExists.length === 0) {
      const hashedPassword = await hash(password, 8)
      const user = await knex('users').insert({
        name,
        email,
        password: hashedPassword
      })
    } else {
      throw new AppError('Este e-mail ja esta em uso')
    }

    return response.status(201).json()
  }

  async update(request, response) {
    const user_id = request.user.id

    const { name, email, password, new_password } = request.body

    const userExists = await knex('users').where({ email })

    if (userExists.length === 1 && userExists[0].id !== user_id) {
      throw new AppError('Email já cadastrado')
    }

    if (password && new_password) {
      const validUserPassword = await knex
        .select('password')
        .from('users')
        .where('id', user_id)

      console.log(password)

      const checkOldPassword = await compare(
        password,
        validUserPassword[0].password
      )
      const att_password = await hash(new_password, 8)
      if (!checkOldPassword) {
        throw new AppError('A senha antiga nao confere')
      }

      const user_update = await knex('users').where('id', user_id).update({
        password: att_password
      })
    }

    const user_update = await knex('users').where('id', user_id).update({
      name,
      email
    })

    return response.json()
  }

  async delete(request, response) {
    const { user_id } = request.params

    const user_delete = await knex('users').where('id', user_id).del()

    return response.json()
  }
}

module.exports = UserController
