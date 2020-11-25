const joi = require('joi')
const jwt = require('jsonwebtoken')
const responseStandard = require('../helpers/response')
const { user } = require('../models')

const { APP_KEY } = process.env

module.exports = {
  registerPhone: async (req, res) => {
    const schema = joi.object({
      phone: joi.string().required()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const result = await user.findOne({ where: { phone: results.phone } })
      if (result) {
        const { id, phone } = result
        jwt.sign({ id: id }, `${APP_KEY}`, {
          expiresIn: '7d'
        }, (_err, token) => {
          return responseStandard(res, 'Login succesfully', { phone: phone, Token: `${token}` })
        })
      } else {
        const result = await user.create(results)
        if (result) {
          const { id, phone } = result
          jwt.sign({ id: id }, `${APP_KEY}`, {
            expiresIn: '7d'
          }, (_err, token) => {
            return responseStandard(res, 'register succesfully', { phone: phone, Token: `${token}` })
          })
        } else {
          return responseStandard(res, 'register failed', {}, 400, false)
        }
      }
    }
  },
  updateProfile: async (req, res) => {
    const id = req.user.id
    const schema = joi.object({
      name: joi.string().required(),
      about: joi.string()
    })
    const { value: results, error } = schema.validate(req.body)
    if (error) {
      return responseStandard(res, 'Error', { error: error.message }, 401, false)
    } else {
      const result = await user.findOne({ where: { id: id } })
      if (result) {
        result.update(results)
        return responseStandard(res, 'update succesfully', { data: result })
      } else {
        return responseStandard(res, 'failed update profile', {}, 400, false)
      }
    }
  },
  getProfile: async (req, res) => {
    const id = req.user.id
    const result = await user.findByPk(id)
    if (result) {
      return responseStandard(res, 'success get profile', { data: result })
    } else {
      return responseStandard(res, 'data not found', {}, 400, false)
    }
  },
  getProfileById: async (req, res) => {
    const { id } = req.params
    const result = await user.findByPk(id)
    if (result) {
      return responseStandard(res, 'success get profile', { data: result })
    } else {
      return responseStandard(res, 'data not found', {}, 400, false)
    }
  },
  upload: async (req, res) => {
    const id = req.user.id
    const picture = { avatar: `/uploads/${req.file.filename}` }
    const result = await user.findByPk(id)
    if (result) {
      result.update(picture)
      return responseStandard(res, 'update image succesfully', { image: result.picture })
    } else {
      return responseStandard(res, 'update image failed', {}, 400, false)
    }
  }
}
