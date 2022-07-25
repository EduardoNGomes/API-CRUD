const knex = require('../database/knex')

class TagsController {
  async show(request, response) {
    const { name } = request.params

    const tagName = await knex.select('name').from('movie_tags').where({ name })

    return response.json(tagName)
  }
}

module.exports = TagsController
