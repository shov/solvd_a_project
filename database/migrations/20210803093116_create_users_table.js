exports.up = function (knex) {
  return knex.raw(
    // language=sql
    `
      CREATE TABLE users (
        id         BIGSERIAL PRIMARY KEY,
        email      TEXT                                     NOT NULL UNIQUE,
        hash       VARCHAR(128) CHECK ( length(hash) = 128) NOT NULL,
        created_at TIMESTAMP WITHOUT TIME ZONE              NOT NULL,
        updated_at TIMESTAMP WITHOUT TIME ZONE
      );
    `)
}

exports.down = function (knex) {
  return knex.schema.dropTable('users')
}
