const { message, user } = require('../models')
const joi = require('joi')
const responseStandard = require('../helpers/response')
const { Op } = require('sequelize')
const qs = require('querystring')

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
    let { limit, page } = req.query
    if (!limit) {
      limit = 30
    } else {
      limit = parseInt(limit)
    }
    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    const result = await message.findAndCountAll({
      where: {
        [Op.or]: [
          { [Op.and]: [{ sender: iduser }, { recipient: id }] },
          { [Op.and]: [{ sender: id }, { recipient: iduser }] }
        ]
      },
      order: [['createdAt', 'DESC']],
      limit: limit,
      offset: (page - 1) * limit
    })
    const pageInfo = {
      count: result.count,
      pages: 0,
      currentPage: page,
      limitPerPage: limit,
      nextLink: null,
      prevLink: null
    }
    pageInfo.pages = Math.ceil(result.count / limit)

    const { pages, currentPage } = pageInfo
    if (currentPage < pages) {
      pageInfo.nextLink = `http://54.147.40.208:8585/chat/receive/detail/${id}?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
    }
    if (currentPage > 1) {
      pageInfo.prevLink = `http://54.147.40.208:8585/chat/receive/detail/${id}?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
    }
    if (result) {
      return responseStandard(res, 'your message', { result, pageInfo })
    } else {
      return responseStandard(res, 'fail get your message', {}, 400, false)
    }
  },
  chatList: async (req, res) => {
    const iduser = req.user.id
    let { limit, page } = req.query
    if (!limit) {
      limit = 7
    } else {
      limit = parseInt(limit)
    }
    if (!page) {
      page = 1
    } else {
      page = parseInt(page)
    }
    const result = await message.findAndCountAll({
      include: [
        { model: user, as: 'send', attributes: { include: ['name', 'avatar', 'createdAt'] } },
        { model: user, as: 'receiver', attributes: { include: ['name', 'avatar', 'createdAt'] } }
      ],
      order: [['createdAt', 'DESC']],
      where: {
        [Op.or]: [
          { [Op.and]: [{ sender: iduser }, { isLatest: 1 }] },
          { [Op.and]: [{ recipient: iduser }, { isLatest: 1 }] }
        ]
      },
      limit: limit,
      offset: (page - 1) * limit
    })
    const pageInfo = {
      count: result.count,
      pages: 0,
      currentPage: page,
      limitPerPage: limit,
      nextLink: null,
      prevLink: null
    }
    pageInfo.pages = Math.ceil(result.count / limit)

    const { pages, currentPage } = pageInfo
    if (currentPage < pages) {
      pageInfo.nextLink = `http://54.147.40.208:8585/chat/receive?${qs.stringify({ ...req.query, ...{ page: page + 1 } })}`
    }
    if (currentPage > 1) {
      pageInfo.prevLink = `http://54.147.40.208:8585/chat/receive?${qs.stringify({ ...req.query, ...{ page: page - 1 } })}`
    }
    if (result) {
      return responseStandard(res, 'chat list', { result, pageInfo })
    } else {
      return responseStandard(res, 'you have no message', {}, 400, false)
    }
  }
}
