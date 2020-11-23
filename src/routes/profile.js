const route = require('express').Router()
const user = require('../controllers/users')

route.patch('/update', user.updateProfile)
route.get('/', user.getProfile)
route.get('/detail/:id', user.getProfileById)

module.exports = route
