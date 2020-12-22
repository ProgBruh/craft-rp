const Koa = require('koa')
const cors = require('@koa/cors')
const passport = require('./passport')
const routes = require('./routes')
const app = new Koa()

app.use(cors())

app.use(passport.initialize())
app.use(routes.routes()).use(routes.allowedMethods())

module.exports = app.callback()
