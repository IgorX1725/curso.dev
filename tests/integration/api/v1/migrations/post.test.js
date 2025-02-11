import orchestrator from "tests/orchestrator";

let migrationRequest;

beforeAll(async () => {
  await orchestrator.waitForAllServices();
  await orchestrator.clearDatabase();
  migrationRequest = () =>
    fetch("http://localhost:3000/api/v1/migrations", { method: "POST" });
});

describe("POST /api/v1/migrations", () => {
  describe("Anonymous user", () => {
    describe("Running pending migrations", () => {
      test("For the first time", async () => {
        const responseBeforeMigrationsToBeRun = await migrationRequest();
        expect(responseBeforeMigrationsToBeRun.status).toBe(201);

        const responseBodyBeforeMigrationsToBeRun =
          await responseBeforeMigrationsToBeRun.json();

        expect(Array.isArray(responseBodyBeforeMigrationsToBeRun)).toBe(true);
        expect(responseBodyBeforeMigrationsToBeRun.length).toBeGreaterThan(0);
      });

      test("For the second time", async () => {
        const responseAfterMigrationsToBeRun = await migrationRequest();
        expect(responseAfterMigrationsToBeRun.status).toBe(200);

        const responseBodyAfterMigrationsToBeRun =
          await responseAfterMigrationsToBeRun.json();

        expect(Array.isArray(responseBodyAfterMigrationsToBeRun)).toBe(true);
        expect(responseBodyAfterMigrationsToBeRun.length).toEqual(0);
      });
    });
  });
});
