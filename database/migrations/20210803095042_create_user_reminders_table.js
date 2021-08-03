exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE user_reminders (
      id          BIGSERIAL PRIMARY KEY,

      user_id     BIGINT REFERENCES users(id) ON DELETE CASCADE ON UPDATE CASCADE,
      reminder_id BIGINT REFERENCES reminders(id) ON DELETE CASCADE ON UPDATE CASCADE,
      role        TEXT                        NOT NULL CHECK ( role IN ('guest', 'creator') ),

      UNIQUE (user_id, reminder_id),

      created_at  TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      updated_at  TIMESTAMP WITHOUT TIME ZONE
    );
    CREATE INDEX user_reminders_user_id_idx ON user_reminders(user_id);
    CREATE INDEX user_reminders_reminder_id_idx ON user_reminders(reminder_id);
  `)
}

exports.down = function (knex) {
  return knex.schema.dropTable('user_reminders')
}
