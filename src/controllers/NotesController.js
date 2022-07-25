const knex = require('../database/knex')

const AppError = require('../utils/AppError')

class NotesController {
  async create(request, response) {
    const { user_name, title, description, rating, tags } = request.body
    const { user_id } = request.params

    const validUser = await knex('users')
      .where('name', user_name)
      .andWhere('id', user_id)

    if (validUser.length === 0) {
      throw new AppError(
        'Nao foi possivel criar a nota, usuario nao encontrado'
      )
    }

    if (rating < 0 || rating > 5) {
      throw new AppError(
        'A nota do filme nao pode ser menor que zero, nem maior de 5'
      )
    }

    const note_id = await knex('movie_notes').insert({
      title,
      description,
      user_grade: rating,
      user_id
    })

    const tagInsert = tags.map(name => {
      return {
        note_id,
        name,
        user_id
      }
    })

    await knex('movie_tags').insert(tagInsert)

    return response.json()
  }

  async show(request, response) {
    const { user_id } = request.params

    const notes = await knex
      .select('title', 'description')
      .from('movie_notes')
      .where({ user_id })
      .orderBy('created_at')

    return response.json(notes)
  }

  async delete(request, response) {
    const { note_id } = request.params
    console.log(note_id)

    await knex('movie_notes').where('id', note_id).delete()

    return response.json()
  }
}

module.exports = NotesController
