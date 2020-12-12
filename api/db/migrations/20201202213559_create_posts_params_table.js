exports.up = (knex, Promise) => {
  return knex.schema.createTable('posts_params', (table) => {
    table.increments('id').primary()
    table.string('type', 50).notNullable()
    table.text('value', 50).notNullable().unique()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('posts_params')
}
