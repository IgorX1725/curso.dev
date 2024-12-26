import database from "infra/database";

const status = async (req, res) => {
  const updatedAt = new Date().toISOString();
  const databaseVersion = await database.query("SHOW server_version;");
  const databaseMaxConnections = await database.query("SHOW max_connections;");

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
};

export default status;
