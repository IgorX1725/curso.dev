import { Client } from "pg";

const query = async (queryObject) => {
  let client;

  try {
    client = await getNewClient();

    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    console.log("\n Error into database.js catch:");
    throw error;
  } finally {
    await client?.end();
  }
};

const getNewClient = async () => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
    ssl: getSSLValues(),
  });

  await client.connect();
  return client;
};

const getSSLValues = () => {
  if (process.env.POSTGRES_CA) {
    return process.env.POSTGRES_CA;
  }

  return process.env.NODE_ENV === "production";
};

const database = {
  query,
  getNewClient,
};

export default database;
