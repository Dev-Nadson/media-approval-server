import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('sessions', (table) => {
    table.string('id', 24).primary().notNullable();
    table.string('url_id', 8).notNullable();
    table.string('author_id', 24).references('id').inTable('admins').notNullable();
    table.string('title').notNullable();
    table.string('description')
    table.string('client_email').notNullable();
    table.string('password_hash').notNullable();
    table.timestamp('expires_at').notNullable();
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    table.timestamp('deleted_at');

    table.index('id');
    table.index('url_id');
    table.index(['client_email', 'deleted_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('sessions');
}
