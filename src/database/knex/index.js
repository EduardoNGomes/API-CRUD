const config = require('../../../knexfile')
const knex = require('knex')

const connect = knex(config.development)

module.exports = connect
