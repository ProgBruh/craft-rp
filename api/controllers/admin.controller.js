const fs = require('fs')
const path = require('path')
const jwt = require('jsonwebtoken')
const passport = require('koa-passport')
const promisePipe = require('promisepipe')
const RandExp = require('randexp')
const PostService = require('../services/post.service.js')
const PostParamsService = require('../services/postParams.service.js')
const UserService = require('../services/user.service.js')
const CommentariesService = require('../services/comment.service.js')
require('dotenv').config({ path: '../.env' })

const auth = async (ctx) => {
  try {
    await passport.authenticate('local', (err, user) => {
      if (!user || !user.is_super_user) {
        ctx.status = 403
        return (ctx.body = err || 'Ошибка входа')
      }
      const payload = {
        id: user.id,
      }
      const token = jwt.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '24h',
      })
      ctx.body = { token }
    })(ctx)
  } catch {
    ctx.status = 500
  }
}

const getPosts = async (ctx) => {
  try {
    const page = ctx.params.page
    ctx.body = await PostService.getAdminPosts(page || 1)
  } catch {
    ctx.status = 500
  }
}

const getPost = async (ctx) => {
  try {
    const post = await PostService.getAdminPost(ctx.params.id)
    ctx.body = post
  } catch {
    ctx.status = 500
  }
}

const getStatistic = async (ctx) => {
  try {
    ctx.body = await PostService.getStatistic()
  } catch {
    ctx.status = 500
  }
}

const getRecommendedPosts = async (ctx) => {
  try {
    const page = ctx.params.page
    const whereData = `is_recommended = 't'`
    const posts = await PostService.getAdminPosts(page || 1, whereData)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

const searchPosts = async (ctx) => {
  try {
    const page = ctx.params.page
    const whereData = `title like '%${ctx.params.title}%'`
    const posts = await PostService.getAdminPosts(page || 1, whereData)
    ctx.body = posts
  } catch {
    ctx.status = 500
  }
}

const createPost = async (ctx) => {
  try {
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
  } catch {
    ctx.status = 500
  }
}

const updatePost = async (ctx) => {
  try {
    const newData = {
      title: ctx.request.body.title || null,
      description: ctx.request.body.description || null,
      link: ctx.request.body.link || null,
      is_recommended: ctx.request.body.is_recommended || null,
      resolution: ctx.request.body.resolution || null,
      version: ctx.request.body.version || null,
    }
    await PostService.updatePost(ctx.request.body.id, newData)
    ctx.status = 201
  } catch {
    ctx.status = 500
  }
}

const deletePost = async (ctx) => {
  try {
    const post = await PostService.deletePost(ctx.params.id)
    fs.unlinkSync(path.join(getUploadPath(), post[0].preview_image))
    if (post[0].images) {
      post[0].images.forEach((el) => {
        fs.unlinkSync(path.join(getUploadPath(), el))
      })
    }
    ctx.status = 204
  } catch {
    ctx.status = 500
  }
}

const setPreviewImage = async (ctx) => {
  try {
    const post = await PostService.getAdminPost(ctx.request.body.id)
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
  } catch {
    ctx.status = 500
  }
}

const addPostImage = async (ctx) => {
  try {
    const post = await PostService.getAdminPost(ctx.request.body.id)
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
  } catch {
    ctx.status = 500
  }
}

const deletePostImage = async (ctx) => {
  try {
    const post = await PostService.getAdminPost(ctx.request.body.id)
    let images = post[0].images
    images = images.filter((el) => el !== ctx.request.body.filename)
    fs.unlinkSync(path.join(getUploadPath(), ctx.request.body.filename))
    await PostService.updatePost(ctx.request.body.id, { images })
    ctx.status = 200
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

const createPostParam = async (ctx) => {
  try {
    ctx.body = await PostParamsService.createPostParam(
      ctx.request.body.type,
      ctx.request.body.value
    )
  } catch {
    ctx.status = 500
  }
}

const deletePostParam = async (ctx) => {
  try {
    await PostParamsService.removePostParam(ctx.request.body.id)
    ctx.status = 200
  } catch {
    ctx.status = 500
  }
}

const getUsers = async (ctx) => {
  try {
    const page = ctx.params.page
    ctx.body = await UserService.getUsers(page || 1)
  } catch {
    ctx.status = 500
  }
}

const searchUsers = async (ctx) => {
  try {
    const page = ctx.params.page
    const whereData = `email like '%${ctx.params.data}%' OR username like '%${ctx.params.data}%'`
    const users = await UserService.getUsers(page || 1, whereData)
    ctx.body = users
  } catch {
    ctx.status = 500
  }
}

const blockUser = async (ctx) => {
  try {
    const whereData = `id = ${ctx.request.body.id}`
    const userBlock = await UserService.getUser(whereData, ['is_blocked'])
    await UserService.updateUser(ctx.request.body.id, {
      is_blocked: !userBlock.is_blocked,
    })
    await CommentariesService.deleteComment(`user_id = ${ctx.request.body.id}`)
    ctx.status = 201
  } catch {
    ctx.status = 500
  }
}

const deleteComment = async (ctx) => {
  try {
    await CommentariesService.deleteComment(`id = ${ctx.params.id}`)
    ctx.status = 201
  } catch {
    ctx.status = 500
  }
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
  getRecommendedPosts,
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
  deleteComment,
}
