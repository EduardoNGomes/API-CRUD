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

    console.log(userExists.length)

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

    const validUser = await knex
      .select('id')
      .from('users')
      .where('id', user_id)
      .andWhere({ name })
      .andWhere({ email })

    const validUserPassword = await knex
      .select('password')
      .from('users')
      .where('id', user_id)

    const checkOldPassword = await compare(
      password,
      validUserPassword[0].password
    )

    const att_password = await hash(new_password, 8)

    if (validUser.length === 0) {
      throw new AppError('Informacoes do usuario invalida')
    } //else if (validEmailWithId.length === 0){}
    if (!checkOldPassword) {
      throw new AppError('A senha antiga nao confere')
    }
    console.log(validUser)
    //if()

    const user_update = await knex('users').where('id', user_id).update({
      name: new_name,
      email: new_email,
      password: att_password,
      img
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
