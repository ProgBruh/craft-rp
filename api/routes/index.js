const Router = require('koa-router')
const adminRoutes = require('./admin.js')
const router = new Router()

router.use(adminRoutes.routes()).use(adminRoutes.allowedMethods())

module.exports = router
