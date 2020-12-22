exports.up = (knex, Promise) => {
  return knex.schema.table('posts', (table) => {
    table.integer('resolution').unsigned()
    table.integer('version').unsigned()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.table('posts', (table) => {
    table.dropColumn('resolution')
    table.dropColumn('version')
  })
}
