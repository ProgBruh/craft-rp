const bcrypt = require('bcryptjs')
const knex = require('../db')

class AuthService {
  async getUserByEmail(email, data = ['id']) {
    return await knex('users').select(data).where('email', email).first()
  }

  async getUserById(id, data = ['id']) {
    return await knex('users').select(data).where('id', id).first()
  }

  async checkPassword(email, password) {
    const userPassword = await knex('users')
      .select('password')
      .where('email', email)
      .first()
    return await bcrypt.compareSync(password, userPassword.password)
  }
}

module.exports = new AuthService()
