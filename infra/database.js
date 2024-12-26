import { Client } from "pg";

const query = async (queryObject) => {
  const client = new Client({
    host: process.env.POSTGRES_HOST,
    port: process.env.POSTGRES_PORT,
    user: process.env.POSTGRES_USER,
    database: process.env.POSTGRES_DB,
    password: process.env.POSTGRES_PASSWORD,
  });

  try {
    await client.connect();

    const result = await client.query(queryObject);
    return result;
  } catch (error) {
    throw new Error(error);
  } finally {
    await client.end();
  }
};

export default {
  query: query,
};
