const knex = require('../database/knex')
const AppError = require('../utils/AppError')
const DiskStorage = require('../providers/DiskStorage')

class UserAvatarController {
  async update(request, response) {
    const diskStorage = new DiskStorage()

    const user_id = request.user.id
    const avatarFilename = request.file.filename

    const user = await knex('users').where({ id: user_id }).first()

    if (!user) {
      throw new AppError(
        'Somente usuários autenticados podem mudar a foto de perfil'
      )
    }

    if (user.img) {
      await diskStorage.deleteFile(user.img)
    }

    const filename = await diskStorage.saveFile(avatarFilename)

    user.img = filename

    await knex('users').update(user).where({ id: user_id })

    return response.json(user)
  }
}

module.exports = UserAvatarController
