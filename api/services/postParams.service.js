const knex = require('../db')

class PostParamsService {
  async getPostsParams() {
    const versions = await knex('posts_params')
      .select('*')
      .where('type', 'version')
      .orderBy('id')
    const resolutions = await knex('posts_params')
      .select('*')
      .where('type', 'resolution')
      .orderBy('id')
    return { versions, resolutions }
  }

  async createPostParam(type, value) {
    return await knex('posts_params').returning('*').insert({ type, value })
  }

  async removePostParam(id) {
    await knex('posts_params').where('id', parseInt(id)).del()
  }
}

module.exports = new PostParamsService()
