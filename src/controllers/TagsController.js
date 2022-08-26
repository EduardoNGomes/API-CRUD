const knex = require('../database/knex')

class TagsController {
  async show(request, response) {
    const { note_id } = request.params

    const tags = await knex('movie_tags').andWhere({ note_id }).groupBy('name')

    return response.json(tags)
  }
}

module.exports = TagsController
