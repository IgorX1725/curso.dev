import database from "infra/database.js";
import { ValidationError } from "infra/errors.js";

const create = async (userInputValues) => {
  await validateUniqueEmail(userInputValues.email);
  await validateUniqueUsername(userInputValues.username);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

  async function validateUniqueEmail(email) {
    const results = await database.query({
      text: `
      SELECT
       email
      FROM
       users
      WHERE
       LOWER(email) = LOWER($1)
      `,
      values: [email],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The given email is already in use.",
        action: "Use another email to complete the signup.",
      });
    }
  }

  async function validateUniqueUsername(username) {
    const results = await database.query({
      text: `
      SELECT
       username
      FROM
       users
      WHERE
       LOWER(username) = LOWER($1)
      `,
      values: [username],
    });

    if (results.rowCount > 0) {
      throw new ValidationError({
        message: "The given username is already in use.",
        action: "Use another username to complete the signup.",
      });
    }
  }

  async function runInsertQuery(userInputValues) {
    const results = await database.query({
      text: `
      INSERT INTO 
        users (username, email, password)
      VALUES
       ($1, $2, $3)
       RETURNING
        *
       ;`,
      values: [
        userInputValues.username,
        userInputValues.email,
        userInputValues.password,
      ],
    });

    return results.rows[0];
  }
};

const user = {
  create,
};

export default user;
