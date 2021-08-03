exports.up = function (knex) {
  return knex.raw(
    // language=sql
    `
      CREATE FUNCTION make_sure_creator_is_unique()
        RETURNS TRIGGER
        LANGUAGE plpgsql
      AS
      $$
      DECLARE

      BEGIN
        IF TG_OP != 'INSERT' AND TG_OP != 'UPDATE'
        THEN
          RETURN NEW;
        END IF;

        IF NEW.role = 'creator'
        THEN

          IF (SELECT count(*)
              FROM user_reminders
              WHERE role = 'creator' AND user_reminders.reminder_id = NEW.reminder_id) >= 1
          THEN
            RAISE EXCEPTION 'Cannot have more than one creator';
          END IF;

          RETURN NEW;
        END IF;

        IF NEW.role = 'guest'
        THEN
          IF (SELECT count(*)
              FROM user_reminders
              WHERE role = 'creator' AND user_reminders.reminder_id = NEW.reminder_id) < 1
          THEN
            RAISE EXCEPTION 'Cannot have a guest without a creator';
          END IF;

          RETURN NEW;
        END IF;
      END
      $$;

      CREATE TRIGGER user_reminders_creator_unique_tr
        BEFORE INSERT OR UPDATE
        ON user_reminders
        FOR EACH ROW
      EXECUTE PROCEDURE make_sure_creator_is_unique();
    `)
}

exports.down = function (knex) {
  return knex.raw(
    // language=sql
    `
      DROP TRIGGER user_reminders_creator_unique_tr ON user_reminders;
      DROP FUNCTION make_sure_creator_is_unique();
    `)
}
