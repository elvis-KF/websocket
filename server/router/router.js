// const koa = require('koa')
const user = require('../controller/user')
const api = require('../api')
const Router = require('koa-router')
const router = new Router()
//user
router.post(api.addDpt, user.addDpt)
router.post(api.login, user.login)
router.get(api.getAccount, user.getAccount)
router.post(api.addUser, user.addUser)

module.exports = {
  router
}