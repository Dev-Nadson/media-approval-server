import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
    await knex.schema.createTable('media', (table) => {
        table.string('id', 24).primary().notNullable();
        table.string('session_id', 24).references('id').inTable('sessions');
        table.string('drive_file_id').notNullable();
        table.string('drive_url').notNullable();
        table.string('mime_type').notNullable();
        table.string('title');
        table.text('caption');
        table.integer('status').defaultTo(0).notNullable();
        table.text('status_feedback');
        table.timestamp('resolved_at');
        table.timestamp('created_at').defaultTo(knex.fn.now()).notNullable();
    });
}

export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTableIfExists('media');
}

