import { version as uuidVersion } from "uuid";
import orchestrator from "tests/orchestrator";
import user from "models/user.js";
import password from "models/password.js";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  await orchestrator.runPendingMigrations();
});

const fetchPostDuplicationData = async ({
  username = "duplicationTest",
  email = "duplicationTest",
  password = "pass123",
}) => {
  return await fetch("http://localhost:3000/api/v1/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      username,
      email,
      password,
    }),
  });
};

describe("POST /api/v1/users", () => {
  describe("Anonymous user", () => {
    test("With unique and valid data", async () => {
      const response = await fetch("http://localhost:3000/api/v1/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "johnDoe",
          email: "johndoe@email.com",
          password: "pass123",
        }),
      });

      expect(response.status).toBe(201);

      const responseBody = await response.json();

      expect(responseBody).toEqual({
        id: responseBody.id,
        username: "johnDoe",
        email: "johndoe@email.com",
        password: responseBody.password,
        created_at: responseBody.created_at,
        updated_at: responseBody.updated_at,
      });

      expect(uuidVersion(responseBody.id)).toBe(4);
      expect(Date.parse(responseBody.created_at)).not.toBeNaN();
      expect(Date.parse(responseBody.updated_at)).not.toBeNaN();

      const userInDatabase = await user.findOneByUsername("johnDoe");

      const correctPasswordMatch = await password.compare(
        "pass123",
        userInDatabase.password,
      );
      expect(correctPasswordMatch).toBe(true);

      const incorrectPasswordMatch = await password.compare(
        "wrongPassword",
        userInDatabase.password,
      );
      expect(incorrectPasswordMatch).toBe(false);
    });

    test("With duplicated email", async () => {
      const response1 = await fetchPostDuplicationData({
        email: "duplicatedEmail",
        username: "duplicatedEmail1",
      });

      expect(response1.status).toBe(201);

      const response2 = await fetchPostDuplicationData({
        email: "DuplicatedEmail",
        username: "duplicatedEmail2",
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "The given email is already in use.",
        action: "Use another email to complete the signup.",
        status_code: 400,
      });
    });

    test("With duplicated username", async () => {
      const response1 = await fetchPostDuplicationData({
        email: "duplicatedUsername1",
        username: "duplicatedUsername",
      });

      expect(response1.status).toBe(201);

      const response2 = await fetchPostDuplicationData({
        email: "duplicatedUsername2",
        username: "DuplicatedUsername",
      });

      expect(response2.status).toBe(400);

      const response2Body = await response2.json();

      expect(response2Body).toEqual({
        name: "ValidationError",
        message: "The given username is already in use.",
        action: "Use another username to complete the signup.",
        status_code: 400,
      });
    });
  });
});
