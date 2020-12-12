const enviroment = process.env.NODE_ENV
// const { attachPaginate } = require('knex-paginate')
const knex = require('knex')
const config = require('../knexfile.js')[enviroment]
// attachPaginate()

module.exports = knex(config)
