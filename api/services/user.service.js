const bcrypt = require('bcryptjs')
const knex = require('../db')

class UserService {
  async getUsers(page, whereData) {
    return await knex('users')
      .select('*')
      .whereRaw(whereData || '')
      .orderBy('id')
      .paginate({ perPage: 6, currentPage: parseInt(page) })
  }

  async getUser(whereData, data = ['id']) {
    return await knex('users').select(data).whereRaw(whereData).first()
  }

  async registerUser(data) {
    await knex('users').insert(data)
  }

  async updateUser(id, newData) {
    await knex('users')
      .where({ id: parseInt(id) })
      .update(newData)
  }

  async checkPassword(email, password) {
    const userPassword = await knex('users')
      .select('password')
      .where('email', email)
      .first()
    return await bcrypt.compareSync(password, userPassword.password)
  }
}

module.exports = new UserService()
