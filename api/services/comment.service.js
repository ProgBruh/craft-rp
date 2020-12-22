const knex = require('../db')

class CommentService {
  async getCommentaries(postId, page) {
    return await knex('commentaries')
      .join('users', 'commentaries.user_id', 'users.id')
      .select(
        'commentaries.id',
        'commentaries.text',
        'commentaries.created_at',
        'commentaries.is_updated',
        'commentaries.user_id',
        'users.username'
      )
      .where('commentaries.post_id', parseInt(postId))
      .orderBy('id')
      .paginate({ perPage: 10, currentPage: parseInt(page) })
  }

  async createComment(postId, userId, text) {
    return await knex
      .with(
        'insert_table',
        knex.raw(
          `INSERT INTO commentaries (post_id, user_id, text) VALUES (?, ?, ?) RETURNING *`,
          [parseInt(postId), parseInt(userId), text]
        )
      )
      .select(
        'insert_table.id',
        'insert_table.text',
        'insert_table.created_at',
        'insert_table.is_updated',
        'users.username'
      )
      .join('users', 'insert_table.user_id', 'users.id')
      .from('insert_table')
  }

  async updateComment(id, userId, text) {
    await knex('commentaries')
      .where({ id: parseInt(id) })
      .andWhere('user_id', parseInt(userId))
      .update({
        text,
        is_updated: true,
      })
  }

  async deleteComment(whereData) {
    await knex('commentaries').whereRaw(whereData).del()
  }
}

module.exports = new CommentService()
