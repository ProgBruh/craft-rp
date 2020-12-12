const Koa = require('koa')
const passport = require('./passport')
const routes = require('./routes')
const app = new Koa()

app.use(passport.initialize())
app.use(routes.routes()).use(routes.allowedMethods())

module.exports = app.callback()
