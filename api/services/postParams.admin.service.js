const knex = require('../db')

class PostParamsService {
  async getPostsParams() {
    const versions = await knex('posts_params')
      .select('*')
      .where('type', 'version')
    const resolutions = await knex('posts_params')
      .select('*')
      .where('type', 'resolution')
    return { versions, resolutions }
  }

  async createPostParam(type, value) {
    return await knex('posts_params').returning('*').insert({ type, value })
  }

  async removePostParam(id) {
    await knex('posts_params').where('id', id).del()
  }
}

module.exports = new PostParamsService()
