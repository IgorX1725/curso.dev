import database from "infra/database.js";
import password from "./password.js";
import { ValidationError, NotFoundError } from "infra/errors.js";

const findOneByUsername = async (username) => {
  async function runSelectQuery(username) {
    const results = await database.query({
      text: `
      SELECT
       *
      FROM
       users
      WHERE
       LOWER(username) = LOWER($1)
       LIMIT 1;
      `,
      values: [username],
    });

    if (results.rowCount === 0) {
      throw new NotFoundError({
        message: "The specified username was not found in the system.",
        action: "Please verify that the username is spelled correctly.",
      });
    }

    return results.rows[0];
  }

  const foundUser = await runSelectQuery(username);
  return foundUser;
};

const create = async (userInputValues) => {
  await validateUniqueUsername(userInputValues.username);
  await validateUniqueEmail(userInputValues.email);
  await hashPasswordInObject(userInputValues);

  const newUser = await runInsertQuery(userInputValues);
  return newUser;

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

const update = async (username, userInputValues) => {
  const currentUser = await findOneByUsername(username);

  if ("username" in userInputValues) {
    await validateUniqueUsername(userInputValues.username);
  }

  if ("email" in userInputValues) {
    await validateUniqueEmail(userInputValues.email);
  }

  if ("password" in userInputValues) {
    await hashPasswordInObject(userInputValues);
  }

  const userWithNewValues = { ...currentUser, ...userInputValues };

  const updatedUser = await runUpdateQuery(userWithNewValues);
  return updatedUser;

  async function runUpdateQuery(userWithNewValues) {
    const results = await database.query({
      text: `
      UPDATE
        users
      SET
        username = $2,
        email = $3,
        password = $4,
        updated_at = timezone('utc', now())
      WHERE
        id = $1
      RETURNING
        *`,
      values: [
        userWithNewValues.id,
        userWithNewValues.username,
        userWithNewValues.email,
        userWithNewValues.password,
      ],
    });

    return results.rows[0];
  }
};

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
      action: "Use another username to complete this action.",
    });
  }
}

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
      action: "Use another email to complete this action.",
    });
  }
}

async function hashPasswordInObject(userInputValues) {
  const hashedPassword = await password.hash(userInputValues.password);
  userInputValues.password = hashedPassword;
}

const user = {
  create,
  update,
  findOneByUsername,
};

export default user;
