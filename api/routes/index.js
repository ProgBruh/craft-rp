const Router = require('koa-router')
const koaBody = require('koa-body')({ multipart: true })
const passport = require('koa-passport')
const {
  register,
  auth,
  getPosts,
  getRecommendedPosts,
  getFilteredPosts,
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
} = require('../controllers/index.controller.js')
const adminRoutes = require('./admin.js')
const router = new Router()

router.use(adminRoutes.routes()).use(adminRoutes.allowedMethods())
router
  .post('/register', koaBody, register)
  .post('/auth', koaBody, auth)
  .get('/get_posts/:page*', getPosts)
  .get('/get_recommended_posts', getRecommendedPosts)
  .post('/get_filtered_posts/:page*', koaBody, getFilteredPosts)
  .get('/get_post/:id', getPost)
  .get('/get_posts_params', getPostsParams)
  .get(
    '/check_vote/:postId',
    passport.authenticate('auth-jwt', { session: false }),
    checkVoted
  )
  .post(
    '/set_vote',
    passport.authenticate('auth-jwt', { session: false }),
    koaBody,
    setVote
  )
  .get('/get_commentaries/:postId/:page*', getCommentaries)
  .post(
    '/create_comment/:postId',
    passport.authenticate('auth-jwt', { session: false }),
    koaBody,
    createComment
  )
  .put(
    '/update_comment/:id',
    passport.authenticate('auth-jwt', { session: false }),
    koaBody,
    updateComment
  )
  .delete(
    '/delete_comment/:id',
    passport.authenticate('auth-jwt', { session: false }),
    deleteComment
  )
  .get(
    '/get_user_info',
    passport.authenticate('auth-jwt', { session: false }),
    getUserInfo
  )
  .get(
    '/get_user_voted_posts/:page*',
    passport.authenticate('auth-jwt', { session: false }),
    getUserVotedPosts
  )

module.exports = router
