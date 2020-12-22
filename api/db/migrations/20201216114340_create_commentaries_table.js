exports.up = (knex, Promise) => {
  return knex.schema.createTable('commentaries', (table) => {
    table.increments('id').primary()
    table.integer('post_id').unsigned()
    table.integer('user_id').unsigned()
    table.text('text').notNullable()
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6))
    table.boolean('is_updated').notNullable().defaultTo(0)
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('commentaries')
}
