exports.up = (knex, Promise) => {
  return knex.schema.createTable('users', (table) => {
    table.increments('id').primary()
    table.string('email', 75).notNullable().unique()
    table.string('username', 75).notNullable().unique()
    table.datetime('created_at', { precision: 6 }).defaultTo(knex.fn.now(6))
    table.boolean('is_super_user').notNullable().defaultTo(0)
    table.boolean('is_blocked').notNullable().defaultTo(0)
    table.string('password').notNullable()
  })
}

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('users')
}
