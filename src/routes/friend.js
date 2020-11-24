const route = require('express').Router()
const friend = require('../controllers/friends')

route.post('/add', friend.addContact)
route.get('/', friend.getFriend)

module.exports = route
