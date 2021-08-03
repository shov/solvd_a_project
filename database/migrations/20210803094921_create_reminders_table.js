exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE reminders (
      id          BIGSERIAL PRIMARY KEY,
      message     TEXT,
      fire_time   TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      repeat_rule JSONB DEFAULT '{ }'::JSONB,

      created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      updated_at  TIMESTAMP WITHOUT TIME ZONE
    );
  `)
}

exports.down = function (knex) {
  return knex.schema.dropTable('reminders')
}
