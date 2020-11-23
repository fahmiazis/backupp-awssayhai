const route = require('express').Router()
const friend = require('../controllers/friends')

route.post('/add', friend.addContact)

module.exports = route
