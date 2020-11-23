const route = require('express').Router()
const message = require('../controllers/message')

route.post('/send/:id', message.sendMessage)
route.get('/receive/detail/:id', message.readMessage)
route.get('/receive', message.chatList)

module.exports = route
