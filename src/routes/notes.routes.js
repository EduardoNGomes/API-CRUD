const { Router } = require('express')
const NotesController = require('../controllers/NotesController')

const notesController = new NotesController()
const notesRoutes = Router()

notesRoutes.post('/:user_id', notesController.create)
notesRoutes.delete('/:note_id', notesController.delete)
notesRoutes.get('/:user_id', notesController.show)

module.exports = notesRoutes
