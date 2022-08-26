const { Router } = require('express')
const NotesController = require('../controllers/NotesController')
const ensureAuthenticated = require('../middleware/ensureAuthenticated')

const notesController = new NotesController()
const notesRoutes = Router()

notesRoutes.use(ensureAuthenticated)

notesRoutes.post('/', notesController.create)
notesRoutes.delete('/:note_id', notesController.delete)
notesRoutes.get('/', notesController.show)
notesRoutes.get('/:id', notesController.index)

module.exports = notesRoutes
