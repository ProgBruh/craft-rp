const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const exctractJwt = require('passport-jwt').ExtractJwt
const UserService = require('./services/user.service.js')
require('dotenv').config({ path: '../.env' })

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async function (username, password, done) {
      const whereData = `email = '${username}'`
      const user = await UserService.getUser(whereData, [
        'id',
        'username',
        'is_blocked',
        'is_super_user',
      ])
      if (!user || !(await UserService.checkPassword(username, password))) {
        return done('Ошибка входа')
      }
      return done(null, user)
    }
  )
)

passport.use(
  'admin-auth-jwt',
  new JwtStrategy(
    {
      jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      const whereData = `id = ${payload.id}`
      const user = await UserService.getUser(whereData, ['is_super_user'])
      if (user && user.is_super_user) {
        return done(null, user)
      } else {
        return done('Ошибка входа', false)
      }
    }
  )
)

passport.use(
  'auth-jwt',
  new JwtStrategy(
    {
      jwtFromRequest: exctractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (payload, done) => {
      const whereData = `id = ${payload.id}`
      const user = await UserService.getUser(whereData, ['id'])
      if (user) {
        return done(null, user)
      } else {
        return done('Ошибка входа', false)
      }
    }
  )
)

module.exports = passport
