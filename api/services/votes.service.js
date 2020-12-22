const knex = require('../db')

class VotesService {
  async createVote(userId, postId) {
    await knex('votes').insert({
      user_id: parseInt(userId),
      post_id: parseInt(postId),
    })
  }

  async deleteVote(userId, postId) {
    await knex('votes')
      .where('user_id', parseInt(userId))
      .andWhere('post_id', parseInt(postId))
      .del()
  }

  async checkVoted(userId, postId) {
    const voted = await knex.raw(
      `
            SELECT
                EXISTS(
                    SELECT
                    FROM
                        votes
                    WHERE
                        user_id = ?
                        AND
                        post_id = ?
                )
        `,
      [parseInt(userId), parseInt(postId)]
    )
    return voted.rows[0].exists
  }
}

module.exports = new VotesService()
