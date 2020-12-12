const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const promisePipe = require('promisepipe')
const RandExp = require('randexp')
const PostService = require('../services/post.admin.service.js')
const PostParamsService = require('../services/postParams.admin.service.js')
const UserService = require('../services/user.admin.service.js')
require('dotenv').config({ path: '../.env' })

const auth = async (ctx, next) => {
  await passport.authenticate('local', (err, user) => {
    if (!user || !user.is_super_user) {
      ctx.status = 403
      return (ctx.body = err || 'Ошибка входа')
    }
    const payload = {
      id: user.id,
    }
    const token = jwt.sign(payload, process.env.SECRET, { expiresIn: '24h' })
    ctx.body = { token }
  })(ctx, next)
}

const getPosts = async (ctx) => {
  const page = ctx.params.page
  ctx.body = await PostService.getPosts(page || 1)
}

const getPost = async (ctx) => {
  const post = await PostService.getPost(ctx.params.id)
  ctx.body = post
}

const getStatistic = (ctx) => {
  ctx.body = 'Posts statistic'
}

const searchPosts = async (ctx) => {
  const posts = await PostService.searchPost(ctx.params.title)
  ctx.body = posts
}

const createPost = async (ctx) => {
  let previewImage = generateFilename()
  while (fs.existsSync(path.join(getUploadPath(), previewImage))) {
    previewImage = generateFilename()
  }
  let images
  if (ctx.request.files.images) {
    images = new Array(ctx.request.files.images.length).fill().map((el) => {
      let imageName = generateFilename()
      while (fs.existsSync(path.join(getUploadPath(), imageName))) {
        imageName = generateFilename()
      }
      return (el = imageName)
    })
  }
  const newPostData = {
    title: ctx.request.body.title,
    description: ctx.request.body.description,
    link: ctx.request.body.link,
    preview_image: previewImage,
    images: images || null,
    resolution: ctx.request.body.resolution,
    version: ctx.request.body.version,
  }
  const newPost = await PostService.createPost(newPostData)
  const readStream = fs.createReadStream(ctx.request.files.previewImage.path)
  const writeStream = fs.createWriteStream(
    path.join(getUploadPath(), previewImage)
  )
  await promisePipe(readStream, writeStream)
  if (images) {
    images.forEach(async (el, i) => {
      const readStream = fs.createReadStream(ctx.request.files.images[i].path)
      const writeStream = fs.createWriteStream(path.join(getUploadPath(), el))
      await promisePipe(readStream, writeStream)
    })
  }
  ctx.body = newPost[0]
}

const updatePost = async (ctx) => {
  const newData = {
    title: ctx.request.body.title || null,
    description: ctx.request.body.description || null,
    link: ctx.request.body.link || null,
    resolution: ctx.request.body.resolution || null,
    version: ctx.request.body.version || null,
  }
  const updatedPost = await PostService.updatePost(ctx.request.body.id, newData)
  ctx.body = updatedPost
}

const deletePost = async (ctx) => {
  const post = await PostService.deletePost(ctx.params.id)
  fs.unlinkSync(path.join(getUploadPath(), post[0].preview_image))
  if (post[0].images) {
    post[0].images.forEach((el) => {
      fs.unlinkSync(path.join(getUploadPath(), el))
    })
  }
  ctx.status = 204
}

const setPreviewImage = async (ctx) => {
  const post = await PostService.getPost(ctx.request.body.id)
  const previewImage = ctx.request.files.image
  fs.unlinkSync(path.join(getUploadPath(), post[0].preview_image))
  let imageName = generateFilename()
  while (fs.existsSync(path.join(getUploadPath(), imageName))) {
    imageName = generateFilename()
  }
  const readStream = fs.createReadStream(previewImage.path)
  const writeStream = fs.createWriteStream(
    path.join(getUploadPath(), imageName)
  )
  await promisePipe(readStream, writeStream)
  await PostService.updatePost(ctx.request.body.id, {
    preview_image: imageName,
  })
  ctx.body = imageName
}

const addPostImage = async (ctx) => {
  const post = await PostService.getPost(ctx.request.body.id)
  const images = post[0].images || []
  if (images.length + 1 > 5) {
    return (ctx.status = 500)
  }
  const newImage = ctx.request.files.image
  let imageName = generateFilename()
  while (fs.existsSync(path.join(getUploadPath(), imageName))) {
    imageName = generateFilename()
  }
  const readStream = fs.createReadStream(newImage.path)
  const writeStream = fs.createWriteStream(
    path.join(getUploadPath(), imageName)
  )
  await promisePipe(readStream, writeStream)
  images.push(imageName)
  await PostService.updatePost(ctx.request.body.id, { images })
  ctx.body = imageName
}

const deletePostImage = async (ctx) => {
  const post = await PostService.getPost(ctx.request.body.id)
  let images = post[0].images
  images = images.filter((el) => el !== ctx.request.body.filename)
  fs.unlinkSync(path.join(getUploadPath(), ctx.request.body.filename))
  await PostService.updatePost(ctx.request.body.id, { images })
  ctx.status = 200
}

const getPostsParams = async (ctx) => {
  ctx.body = await PostParamsService.getPostsParams()
}

const createPostParam = async (ctx) => {
  ctx.body = await PostParamsService.createPostParam(
    ctx.request.body.type,
    ctx.request.body.value
  )
}

const deletePostParam = async (ctx) => {
  await PostParamsService.removePostParam(ctx.request.body.id)
  ctx.status = 200
}

const getUsers = async (ctx) => {
  const page = ctx.params.page
  ctx.body = await UserService.getUsers(page || 1)
}

const searchUsers = async (ctx) => {
  const users = await UserService.searchUser(ctx.params.data)
  ctx.body = users
}

const blockUser = async (ctx) => {
  const userBlock = await UserService.getUser(ctx.request.body.id, [
    'is_blocked',
  ])
  await UserService.updateUser(ctx.request.body.id, {
    is_blocked: !userBlock.is_blocked,
  })
  ctx.body = !userBlock.is_blocked
}

const getUploadPath = () => {
  return path.join(process.cwd(), 'static', 'public', 'images')
}

const generateFilename = () => {
  return new RandExp('^[A-Za-z0-9]{8}').gen() + '.png'
}

module.exports = {
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
}
