const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')

const app = express()
const server = require('http').createServer(app)
const io = require('socket.io')(server, {})
module.exports = io
const { APP_PORT } = process.env

app.use(bodyParser.urlencoded({ extended: false }))
app.use(morgan('dev'))
app.use(cors())

const userRoute = require('./routes/users')
const profileRoute = require('./routes/profile')
const friendRoute = require('./routes/friend')
const messageRoute = require('./routes/message')

const authMiddleware = require('./middlewares/auth')

app.use('/auth', userRoute)
app.use('/user', authMiddleware, profileRoute)
app.use('/friend', authMiddleware, friendRoute)
app.use('/chat', authMiddleware, messageRoute)
app.use('/uploads', express.static('assets/uploads/'))

app.get('/', (req, res) => {
  res.send({
    success: true,
    message: 'Backend is running'
  })
})

server.listen(APP_PORT, () => {
  console.log(`App listen on port ${APP_PORT}`)
})
