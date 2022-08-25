const config = require('./Utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const notesRouter = require('./Controllers/blogs')
const usersRouter = require('./Controllers/users')
const loginRouter = require('./Controllers/login')
const middleware = require('./Utils/middleware')
const logger = require('./Utils/logger')
const mongoose = require('mongoose')

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
    .then(() => {
        logger.info('connected to MongoDB')
    })
    .catch((error) => {
        logger.error('error connecting to MongoDB:', error.message)
    })

app.use(cors())
app.use(express.static('build'))
app.use(express.json())
app.use(middleware.requestLogger)
app.use(middleware.getTokenFrom)

app.use('/api/login', loginRouter)
app.use('/api/blogs', middleware.userExtractor, notesRouter)
app.use('/api/users', usersRouter)

app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app