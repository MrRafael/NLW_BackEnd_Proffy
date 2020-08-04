import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('class', table => {
        table.increments('id').primary();
        table.string('subject').notNullable();
        table.string('cost').notNullable();
        
        table.integer('user_id')
        .notNullable().references('id').inTable('user')
        .onDelete('CASCADE').onUpdate('CASCADE');
    });
}

export async function down(Knex: Knex) {
    return Knex.schema.dropTable('class');
}