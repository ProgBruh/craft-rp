require('dotenv').config({ path: '../.env' })
const path = require('path')

module.exports = {
  development: {
    client: 'postgresql',
    connection: process.env.PG_CONNECTION_STRING,
    migrations: {
      directory: path.join(__dirname, 'db', 'migrations'),
    },
  },

  production: {
    client: 'postgresql',
    connection: process.env.PG_CONNECTION_STRING,
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
}
