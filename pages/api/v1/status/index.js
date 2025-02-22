import database from "infra/database";
import { InternalServerError } from "infra/errors";

const status = async (req, res) => {
  try {
    const updatedAt = new Date().toISOString();
    const databaseVersion = await database.query("SHOW server_version;");
    const databaseMaxConnections = await database.query(
      "SHOW max_connections;",
    );

    const databaseName = process.env.POSTGRES_DB;
    const databaseUsedConnections = await database.query({
      text: `SELECT COUNT(*)::int AS used_connections FROM pg_stat_activity WHERE datname = $1;`,
      values: [databaseName],
    });

    res.status(200).json({
      updated_at: updatedAt,
      dependencies: {
        database: {
          version: databaseVersion.rows[0].server_version,
          max_connections: parseInt(
            databaseMaxConnections.rows[0].max_connections,
          ),
          used_connections: databaseUsedConnections.rows[0].used_connections,
        },
      },
    });
  } catch (error) {
    const publicErrorObject = new InternalServerError({
      cause: error,
    });

    console.log("\n Error into controller catch:");
    console.error(publicErrorObject);
    res.status(500).json(publicErrorObject);
  }
};

export default status;
