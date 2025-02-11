import retry from "async-retry";
import database from "infra/database";

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

const orchestrator = { waitForAllServices, clearDatabase };

export default orchestrator;
