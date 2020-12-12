const knex = require('../db')

class UserService {
  async getUsers(page) {
    return await knex('users').select('*')
  }

  async getUser(id, data = ['id']) {
    return await knex('users').select(data).where('id', id).first()
  }

  async searchUser(data) {
    return await knex('users')
      .select('*')
      .where('email', 'like', `%${data}%`)
      .orWhere('username', 'like', `%${data}%`)
  }

  async updateUser(id, newData) {
    await knex('users').where({ id }).update(newData)
  }
}

module.exports = new UserService()
