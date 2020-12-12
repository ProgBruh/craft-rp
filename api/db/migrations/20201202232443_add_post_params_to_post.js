exports.up = (knex, Promise) => {
  return knex.schema.table('posts', (table) => {
    table.integer('resolution').unsigned()
    table.integer('version').unsigned()
    table.foreign('resolution').references('posts_params.id')
    table.foreign('version').references('posts_params.id')
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('posts', (table) => {
    table.dropColumn('resolution')
    table.dropColumn('version')
  })
}
