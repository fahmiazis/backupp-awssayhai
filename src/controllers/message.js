const { message } = require('../models')
const joi = require('joi')
const responseStandard = require('../helpers/response')
const { Op } = require('sequelize')

module.exports = {
  sendMessage: async (req, res) => {
    const iduser = req.user.id
    const { id } = req.params
    const schema = joi.object({
      content: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const data = {
        sender: iduser,
        recipient: id,
        content: results.content
      }
      const result = await message.create(data)
      if (result) {
        return responseStandard(res, 'success send message', { result })
      } else {
        return responseStandard(res, 'fail to send message', {}, 400, false)
      }
    }
  },
  readMessage: async (req, res) => {
    const iduser = req.user.id
    const { id } = req.params
    const result = await message.findAndCountAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ sender: iduser }, { recipient: id }] },
          { [Op.and]: [{ sender: id }, { recipient: iduser }] }
        ]
      }
    })
    if (result) {
      return responseStandard(res, 'your message', { result })
    } else {
      return responseStandard(res, 'fail get your message', {}, 400, false)
    }
  },
  chatList: async (req, res) => {
    const iduser = req.user.id
    const result = await message.findAndCountAll({
      order: [['createdAt', 'DESC']],
      where: {
        [Op.or]: [
          { sender: iduser },
          { recipient: iduser }
        ]
      },
      group: ['sender', 'recipient']
    })
    if (result) {
      const send = result.rows.map(item => {
        return item.sender
      })
      const rec = result.rows.map(item => {
        return item.recipient
      })
      const search = await message.findAndCountAll({
        where: {
          [Op.or]: [
            { sender: send },
            { recipient: rec }
          ]
        },
        // limit: 1,
        order: [['createdAt', 'DESC']]
      })
      return responseStandard(res, 'chat list', { result, search })
    } else {
      return responseStandard(res, 'you have no message', {}, 400, false)
    }
  }
}
