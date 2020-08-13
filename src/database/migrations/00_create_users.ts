import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.increments('id').primary();
        table.string('avatar').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.integer('is_teacher').notNullable().defaultTo(0);
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
}