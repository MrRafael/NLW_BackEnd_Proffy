import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('connection', table => {
        table.increments('id').primary();
        table.timestamp('created_at').defaultTo(knex.raw('CURRENT_TIMESTAMP')).notNullable();
        
        table.integer('user_id')
        .notNullable().references('id').inTable('user')
        .onDelete('CASCADE').onUpdate('CASCADE');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('connection');
}