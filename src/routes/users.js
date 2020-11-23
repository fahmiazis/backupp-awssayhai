const route = require('express').Router()
const user = require('../controllers/users')

route.post('/register', user.registerPhone)

module.exports = route
