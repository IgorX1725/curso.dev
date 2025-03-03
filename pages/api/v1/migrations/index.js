import { createRouter } from "next-connect";
import controller from "infra/controller";
import migrator from "model/migrator";

const router = createRouter();

const getHandler = async (req, res) => {
  const pendingMigrations = await migrator.listPendingMigrations();
  res.status(200).json(pendingMigrations);
};

const postHandler = async (req, res) => {
  const migratedMigrations = await migrator.runPendingMigrations();

  const statusCode = migratedMigrations.length > 0 ? 201 : 200;
  return res.status(statusCode).json(migratedMigrations);
};

router.get(getHandler);
router.post(postHandler);

export default router.handler(controller.errorHandlers);
