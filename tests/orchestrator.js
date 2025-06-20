import retry from "async-retry";
import database from "infra/database";
import migrator from "models/migrator";
import user from "models/user";
import { faker } from "@faker-js/faker";

const fetchStatusPage = async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (response.status !== 200) {
    throw new Error();
  }
};

const waitForWebServer = async () => {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });
};

const clearDatabase = async () => {
  await database.query("DROP schema public cascade; create schema public;");
};

const waitForAllServices = async () => {
  await waitForWebServer();
};

const runPendingMigrations = async () => {
  await migrator.runPendingMigrations();
};

const createUser = async (userObject) => {
  return await user.create({
    username:
      userObject.username || faker.internet.username().replace(/[_.-]/g, ""),
    email: userObject.email || faker.internet.email(),
    password: userObject.password || "DefaultPassword",
  });
};

const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
  createUser,
};

export default orchestrator;
