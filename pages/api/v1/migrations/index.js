import { createRouter } from "next-connect";
import migrationRunner from "node-pg-migrate";
import { resolve } from "node:path";
import database from "infra/database";
import controller from "infra/controller";

const router = createRouter();

const defaultMigrationOptions = {
  dryRun: true,
  dir: resolve("infra", "migrations"),
  direction: "up",
  verbose: true,
  migrationsTable: "pgmigrations",
};

const getHandler = async (req, res) => {
  const dbClient = await database.getNewClient();

  try {
    const pendingMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
    });

    res.status(200).json(pendingMigrations);
  } finally {
    await dbClient?.end();
  }
};

const postHandler = async (req, res) => {
  const dbClient = await database.getNewClient();

  try {
    const migratedMigrations = await migrationRunner({
      ...defaultMigrationOptions,
      dbClient,
      dryRun: false,
    });

    const statusCode = migratedMigrations.length > 0 ? 201 : 200;
    return res.status(statusCode).json(migratedMigrations);
  } finally {
    await dbClient?.end();
  }
};

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
