exports.up = function (knex) {
  return knex.raw(`
    CREATE TABLE tokens (
      id         BIGSERIAL PRIMARY KEY,
      user_id    BIGINT REFERENCES users(id) ON DELETE SET NULL ON UPDATE CASCADE,
      content    TEXT                        NOT NULL,
      active     BOOLEAN,
      created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL,
      updated_at TIMESTAMP WITHOUT TIME ZONE
    );
    CREATE INDEX tokens_user_id_idx ON tokens(user_id);

  `)
}

exports.down = function (knex) {
  return knex.schema.dropTable('tokens')
}
