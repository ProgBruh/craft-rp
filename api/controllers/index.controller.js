const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const bcrypt = require('bcryptjs')
const UserService = require('../services/user.service.js')
const PostService = require('../services/post.service.js')
const PostParamsService = require('../services/postParams.service.js')
const VotesService = require('../services/votes.service.js')
const CommentService = require('../services/comment.service.js')

const register = async (ctx) => {
  try {
    const data = {
      email: ctx.request.body.email,
      username: ctx.request.body.username,
      password: bcrypt.hashSync(
        ctx.request.body.password,
        bcrypt.genSaltSync(10)
      ),
    }
    await UserService.registerUser(data)
    ctx.status = 201
  } catch {
    ctx.status = 500
  }
}

const auth = async (ctx) => {
  try {
    await passport.authenticate('local', (err, user) => {
      if (!user) {
        ctx.status = 403
        return (ctx.body = err)
      }
      const payload = {
        id: user.id,
        is_blocked: user.is_blocked,
      }
      if (user.is_super_user) {
        payload.is_super_user = true
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      })
      const auth = { token, user: user.username, is_blocked: user.is_blocked }
      if (user.is_super_user) {
        auth.is_super = true
      }
      ctx.body = auth
    })(ctx)
  } catch {
    ctx.status = 500
  }
}

const getPosts = async (ctx) => {
  try {
    const posts = await PostService.getPosts(ctx.params.page || 1)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

const getFilteredPosts = async (ctx) => {
  try {
    let filter = ''
    if (ctx.request.body.title)
      filter += `title like '%${ctx.request.body.title}%'`
    if (ctx.request.body.resolution)
      filter += `${filter.length ? 'AND' : ''} resolution = ${
        ctx.request.body.resolution
      }`
    if (ctx.request.body.version)
      filter += `${filter.length ? 'AND' : ''} version = ${
        ctx.request.body.version
      }`
    const posts = await PostService.getPosts(ctx.params.page || 1, filter)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

const getRecommendedPosts = async (ctx) => {
  try {
    const filter = `is_recommended = 't'`
    const posts = await PostService.getPosts(1, filter)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

const getPost = async (ctx) => {
  try {
    ctx.body = await PostService.getPost(ctx.params.id)
  } catch {
    ctx.status = 500
  }
}

const getPostsParams = async (ctx) => {
  try {
    ctx.body = await PostParamsService.getPostsParams()
  } catch {
    ctx.status = 500
  }
}

const checkVoted = async (ctx) => {
  try {
    ctx.body = await VotesService.checkVoted(
      ctx.state.user.id,
      ctx.params.postId
    )
  } catch {
    ctx.status = 500
  }
}

const setVote = async (ctx) => {
  try {
    const whereData = `id = ${ctx.state.user.id}`
    const userIsBlocked = await UserService.getUser(whereData, ['is_blocked'])
    if (!userIsBlocked.is_blocked) {
      const postId = ctx.request.body.postId
      const check = await VotesService.checkVoted(ctx.state.user.id, postId)
      if (!check) {
        await VotesService.createVote(ctx.state.user.id, postId)
      } else {
        const whereData = `user_id = ${ctx.state.user.id} AND post_id = ${postId}`
        await VotesService.deleteVotes(whereData)
      }
      ctx.status = 201
    } else {
      ctx.status = 500
    }
  } catch {
    ctx.status = 500
  }
}

const getCommentaries = async (ctx) => {
  try {
    ctx.body = await CommentService.getCommentaries(
      ctx.params.postId,
      ctx.params.page || 1
    )
  } catch {
    ctx.status = 500
  }
}

const createComment = async (ctx) => {
  try {
    const whereData = `id = ${ctx.state.user.id}`
    const userIsBlocked = await UserService.getUser(whereData, ['is_blocked'])
    if (!userIsBlocked.is_blocked) {
      ctx.body = await CommentService.createComment(
        ctx.params.postId,
        ctx.state.user.id,
        ctx.request.body.text
      )
    } else {
      ctx.status = 500
    }
  } catch {
    ctx.status = 500
  }
}

const updateComment = async (ctx) => {
  try {
    const whereData = `id = ${ctx.state.user.id}`
    const userIsBlocked = await UserService.getUser(whereData, ['is_blocked'])
    if (!userIsBlocked.is_blocked) {
      await CommentService.updateComment(
        ctx.params.id,
        ctx.state.user.id,
        ctx.request.body.text
      )
      ctx.status = 204
    } else {
      ctx.status = 500
    }
  } catch {
    ctx.status = 500
  }
}

const deleteComment = async (ctx) => {
  try {
    const whereData = `id = ${ctx.params.id} AND user_id = ${ctx.state.user.id}`
    await CommentService.deleteComment(whereData)
    ctx.status = 204
  } catch {
    ctx.status = 500
  }
}

const getUserInfo = async (ctx) => {
  try {
    const whereData = `id = ${ctx.state.user.id}`
    const user = await UserService.getUser(whereData, [
      'email',
      'username',
      'created_at',
      'is_blocked',
    ])
    ctx.body = user
  } catch {
    ctx.status = 500
  }
}

const getUserVotedPosts = async (ctx) => {
  try {
    const whereData = `
        posts.id in (
            SELECT
                post_id
            FROM
                votes
            WHERE
                user_id = ${ctx.state.user.id}
        )
    `
    const posts = await PostService.getPosts(1, whereData)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

module.exports = {
  register,
  auth,
  getPosts,
  getFilteredPosts,
  getRecommendedPosts,
  getPost,
  getPostsParams,
  checkVoted,
  setVote,
  getCommentaries,
  createComment,
  updateComment,
  deleteComment,
  getUserInfo,
  getUserVotedPosts,
}
