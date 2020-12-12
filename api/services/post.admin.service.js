const knex = require('../db')

class PostService {
  async getPosts(page) {
    return await knex('posts').select('*')
  }

  async getPost(id) {
    return await knex('posts').select('*').where('id', id)
  }

  async getStatistic(id) {
    return await setTimeout(() => {
      return null
    }, 800)
  }

  async searchPost(title) {
    return await knex('posts').select('*').where('title', 'like', `%${title}%`)
  }

  async createPost(newPostData) {
    const newPost = await knex('posts').returning('*').insert({
      title: newPostData.title,
      description: newPostData.description,
      link: newPostData.link,
      preview_image: newPostData.preview_image,
      images: newPostData.images,
      resolution: newPostData.resolution,
      version: newPostData.version,
    })
    return newPost
  }

  async updatePost(id, newData) {
    return await knex('posts').where({ id }).update(newData, '*')
  }

  async deletePost(id) {
    return await knex('posts')
      .returning(['preview_image', 'images'])
      .where('id', id)
      .del()
  }
}

module.exports = new PostService()
