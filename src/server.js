require('express-async-errors')
const express = require('express')
const routes = require('./routes')
const AppError = require('./utils/AppError')
const database = require('./database/sqlite')
const cors = require('cors')
const { UPLOADS_FOLDER } = require('./configs/upload')

const app = express()
app.use(cors())
app.use(express.json())
app.use(routes)
database()

app.use('/files', express.static(UPLOADS_FOLDER))

app.use((error, request, response, next) => {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({
      status: 'error',
      message: error.message
    })
  }
  console.log(error)

  return response.status(500).json({
    status: 'error',
    message: 'Interno server error'
  })
})

const PORT = 3333

app.listen(PORT, () => console.log(`server is running on port ${PORT}`))
