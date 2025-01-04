import database from 'infra/database'

const cleanDatabase = async ()=>{
  await database.query('DROP schema public cascade; create schema public;')
}

beforeAll(cleanDatabase)

test("GET to /api/v1/migrations should return 200", async () => {
  const migrationRequest = ()=> fetch("http://localhost:3000/api/v1/migrations", { method: 'POST'});
  const responseBeforeMigrationsToBeRun = await migrationRequest()
  expect(responseBeforeMigrationsToBeRun.status).toBe(201);

  const responseBodyBeforeMigrationsToBeRun = await responseBeforeMigrationsToBeRun.json()

  expect(Array.isArray(responseBodyBeforeMigrationsToBeRun)).toBe(true)
  expect(responseBodyBeforeMigrationsToBeRun.length).toBeGreaterThan(0)



  const responseAfterMigrationsToBeRun = await migrationRequest()
  expect(responseAfterMigrationsToBeRun.status).toBe(200);

  const responseBodyAfterMigrationsToBeRun = await responseAfterMigrationsToBeRun.json()

  expect(Array.isArray(responseBodyAfterMigrationsToBeRun)).toBe(true)
  expect(responseBodyAfterMigrationsToBeRun.length).toEqual(0)
});
