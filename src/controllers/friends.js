const joi = require('joi')
const responseStandard = require('../helpers/response')
const { friends, user } = require('../models')

module.exports = {
  addContact: async (req, res) => {
    const iduser = req.user.id
    const schema = joi.object({
      phone: joi.string().required(),
      name: joi.string()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const result = await user.findOne({ where: { phone: results.phone } })
      if (result) {
        const { id, phone } = result
        if (id === iduser) {
          return responseStandard(res, 'you cannot add yourself as a friend', {}, 400, false)
        } else {
          if (results.name) {
            const data = {
              userId: iduser,
              name: results.name,
              friendId: id
            }
            const result = await friends.create(data)
            if (result) {
              return responseStandard(res, 'add contact succesfully', { result })
            }
          } else {
            const data = {
              userId: iduser,
              name: phone,
              friendId: id
            }
            const result = await friends.create(data)
            if (result) {
              return responseStandard(res, 'add contact succesfully', { result })
            }
          }
        }
      } else {
        return responseStandard(res, 'phone number is not registered', {}, 400, false)
      }
    }
  },
  getFriend: async (req, res) => {
    const iduser = req.user.id
    const result = await friends.findAndCountAll({
      where: {
        userId: iduser
      },
      order: [['name', 'ASC']],
      include: [
        { model: user, as: 'friend' }
      ]
    })
    if (result) {
      return responseStandard(res, 'list friend', { result })
    } else {
      return responseStandard(res, 'you have no friend', {}, 404, false)
    }
  }
}
