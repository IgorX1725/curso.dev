import retry from "async-retry";
import database from "infra/database";
import migrator from "model/migrator";

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
const orchestrator = {
  waitForAllServices,
  clearDatabase,
  runPendingMigrations,
};

export default orchestrator;
