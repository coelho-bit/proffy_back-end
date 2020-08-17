import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('teacher_schedule', table => {
        table.increments('id').primary();
        table.integer('week_day').notNullable();
        table.integer('from').notNullable();
        table.integer('to').notNullable();

        table.integer('teacher_id')
            .notNullable()
            .references('user_id')
            .inTable('teachers')
            .onUpdate('CASCADE')
            .onDelete('CASCADE');
    })
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('class_schedule');
}