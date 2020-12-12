const Router = require('koa-router')
const koaBody = require('koa-body')({ multipart: true })
const passport = require('koa-passport')
const {
  auth,
  getPosts,
  getPost,
  getStatistic,
  searchPosts,
  createPost,
  updatePost,
  deletePost,
  setPreviewImage,
  addPostImage,
  deletePostImage,
  getPostsParams,
  createPostParam,
  deletePostParam,
  getUsers,
  searchUsers,
  blockUser,
} = require('../controllers/admin.controller.js')
const router = new Router({ prefix: '/admin' })

router
  .post('/auth', koaBody, auth)
  .get(
    '/get_posts/:page*',
    passport.authenticate('admin-auth-jwt', { session: false }),
    getPosts
  )
  .get(
    '/get_post/:id',
    passport.authenticate('admin-auth-jwt', { session: false }),
    getPost
  )
  .get(
    '/get_statistic/:id',
    passport.authenticate('admin-auth-jwt', { session: false }),
    getStatistic
  )
  .get(
    '/search_posts/:title',
    passport.authenticate('admin-auth-jwt', { session: false }),
    searchPosts
  )
  .post(
    '/create_post',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    createPost
  )
  .put(
    '/update_post',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    updatePost
  )
  .delete(
    '/delete_post/:id',
    passport.authenticate('admin-auth-jwt', { session: false }),
    deletePost
  )
  .post(
    '/set_preview_image',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    setPreviewImage
  )
  .post(
    '/add_post_image',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    addPostImage
  )
  .post(
    '/delete_post_image',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    deletePostImage
  )
  .get(
    '/get_posts_params',
    passport.authenticate('admin-auth-jwt', { session: false }),
    getPostsParams
  )
  .post(
    '/create_post_param',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    createPostParam
  )
  .post(
    '/delete_post_param',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    deletePostParam
  )
  .get(
    '/get_users/:page*',
    passport.authenticate('admin-auth-jwt', { session: false }),
    getUsers
  )
  .get(
    '/search_users/:data*',
    passport.authenticate('admin-auth-jwt', { session: false }),
    searchUsers
  )
  .post(
    '/block_user',
    passport.authenticate('admin-auth-jwt', { session: false }),
    koaBody,
    blockUser
  )
module.exports = router
