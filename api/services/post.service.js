const knex = require('../db')

class PostService {
  async getPosts(page, filterData) {
    return await knex('posts')
      .leftJoin('commentaries', 'posts.id', 'commentaries.post_id')
      .leftJoin('votes', 'posts.id', 'votes.post_id')
      .select(
        'posts.id',
        'posts.title',
        'posts.description',
        'posts.link',
        'posts.created_at',
        'posts.is_recommended',
        'posts.preview_image',
        'posts.images'
      )
      .countDistinct('commentaries.id as commentaries')
      .countDistinct('votes.id as votes')
      .whereRaw(filterData || '')
      .groupBy('posts.id')
      .orderBy('id')
      .paginate({ perPage: 6, currentPage: parseInt(page) })
  }

  async getPost(id) {
    return await knex('posts')
      .leftJoin('votes', 'posts.id', 'votes.post_id')
      .select(
        'posts.id',
        'posts.title',
        'posts.description',
        'posts.link',
        'posts.created_at',
        'posts.is_recommended',
        'posts.preview_image',
        'posts.images'
      )
      .countDistinct('votes.id as votes')
      .where('posts.id', parseInt(id))
      .groupBy('posts.id')
      .first()
  }

  async getAdminPosts(page, whereData) {
    return await knex('posts')
      .select('*')
      .whereRaw(whereData || '')
      .orderBy('id')
      .paginate({ perPage: 12, currentPage: parseInt(page) })
  }

  async getAdminPost(id) {
    return await knex('posts').select('*').where('id', parseInt(id))
  }

  async getStatistic() {
    return await knex('posts')
      .leftJoin('votes', 'posts.id', 'votes.post_id')
      .select('posts.title')
      .countDistinct('votes.id as votes')
      .groupBy('posts.id')
      .limit(5)
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
    await knex('posts').where({ id }).update(newData, '*')
  }

  async deletePost(id) {
    return await knex('posts')
      .returning(['preview_image', 'images'])
      .where('id', parseInt(id))
      .del()
  }
}

module.exports = new PostService()
