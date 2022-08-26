const knex = require('../database/knex')

const AppError = require('../utils/AppError')

class NotesController {
  async create(request, response) {
    const { user_name, title, description, rating, tags } = request.body
    const user_id = request.user.id

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
      user_grade: Math.ceil(rating),
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
    const user_id = request.user.id
    const { title } = request.query

    const notes = await knex('movie_notes')
      .whereLike('title', `%${title}%`)
      .andWhere({ user_id })
      .orderBy('created_at')

    const userTags = await knex('movie_tags').where({ user_id })
    const notesWithTags = notes.map(note => {
      const noteTags = userTags.filter(tag => tag.note_id === note.id)

      return {
        ...note,
        tags: noteTags
      }
    })
    return response.json(notesWithTags)
  }

  async index(request, response) {
    const { id } = request.params

    const note = await knex('movie_notes').where({ id }).first()
    const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name')

    return response.json({
      ...note,
      tags
    })
  }

  async delete(request, response) {
    const { note_id } = request.params

    await knex('movie_notes').where('id', note_id).delete()

    return response.json()
  }
}

module.exports = NotesController
