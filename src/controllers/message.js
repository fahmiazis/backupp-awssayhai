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
      const find = await message.findOne({
        where: {
          [Op.or]: [
            { [Op.and]: [{ sender: iduser }, { recipient: id }] },
            { [Op.and]: [{ sender: id }, { recipient: iduser }] }
          ]
        },
        order: [['createdAt', 'DESC']]
      })
      if (find) {
        const late = { isLatest: 0 }
        find.update(late)
        const data = {
          sender: iduser,
          recipient: id,
          content: results.content,
          isLatest: 1
        }
        const result = await message.create(data)
        if (result) {
          return responseStandard(res, 'success send message', { result, find })
        } else {
          return responseStandard(res, 'fail to send message', {}, 400, false)
        }
      } else {
        const data = {
          sender: iduser,
          recipient: id,
          content: results.content,
          isLatest: 1
        }
        const result = await message.create(data)
        if (result) {
          return responseStandard(res, 'success send message', { result })
        } else {
          return responseStandard(res, 'fail to send message', {}, 400, false)
        }
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
      },
      order: [['createdAt', 'DESC']]
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
          { [Op.and]: [{ sender: iduser }, { isLatest: 1 }] },
          { [Op.and]: [{ recipient: iduser }, { isLatest: 1 }] }
        ]
      }
    })
    if (result) {
      return responseStandard(res, 'chat list', { result })
    } else {
      return responseStandard(res, 'you have no message', {}, 400, false)
    }
  }
}
