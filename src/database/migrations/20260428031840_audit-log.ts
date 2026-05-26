import type { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('audit_log', (table) => {
    table.string('id', 24).primary().notNullable();
    table
      .string('session_id', 24)
      .references('id')
      .inTable('sessions')
      .onDelete('SET NULL');
    table
      .string('media_id', 24)
      .references('id')
      .inTable('media')
      .onDelete('SET NULL');
    table.string('actor').notNullable();
    table.string('action').notNullable();
    table.json('metadata');
    table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();

    table.index('id');
    table.index('session_id');
    table.index('media_id');
    table.index(['session_id', 'created_at']);
    table.index(['media_id', 'created_at']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('audit_log');
}
