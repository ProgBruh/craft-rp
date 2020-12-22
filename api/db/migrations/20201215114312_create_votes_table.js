exports.up = (knex, Promise) => {
  return knex.schema.createTable('votes', (table) => {
    table.increments('id').primary()
    table.integer('post_id').unsigned()
    table.integer('user_id').unsigned()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('votes')
}
