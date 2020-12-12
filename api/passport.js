const passport = require('koa-passport')
const LocalStrategy = require('passport-local')
const JwtStrategy = require('passport-jwt').Strategy
const exctractJwt = require('passport-jwt').ExtractJwt
const authService = require('./services/auth.service.js')
require('dotenv').config({ path: '../.env' })

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
      session: false,
    },
    async function (username, password, done) {
      const user = await authService.getUserByEmail(username, [
        'id',
        'is_super_user',
      ])
      if (!user || !(await authService.checkPassword(username, password))) {
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
      secretOrKey: process.env.SECRET,
    },
    async (payload, done) => {
      const user = await authService.getUserById(payload.id, ['is_super_user'])
      if (user && user.is_super_user) {
        return done(null, user)
      } else {
        return done('Ошибка входа', false)
      }
    }
  )
)

module.exports = passport
