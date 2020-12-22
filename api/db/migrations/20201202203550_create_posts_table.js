exports.up = (knex, Promise) => {
  return knex.schema.createTable('posts', (table) => {
    table.increments('id').primary()
    table.string('title', 75).notNullable().unique()
    table.text('description').notNullable()
    table.text('link').notNullable()
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6))
    table.boolean('is_recommended').notNullable().defaultTo(0)
    table.text('preview_image').notNullable().unique()
    table.specificType('images', 'TEXT[]').defaultTo('{}')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('posts')
}
