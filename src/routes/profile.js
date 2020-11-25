const route = require('express').Router()
const user = require('../controllers/users')
const upload = require('../helpers/upload')

route.patch('/update', user.updateProfile)
route.get('/', user.getProfile)
route.get('/detail/:id', user.getProfileById)
route.post('/avatar', upload, user.upload)

module.exports = route
