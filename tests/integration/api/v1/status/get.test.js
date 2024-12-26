test("GET to /api/v1/status should return 200", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parsedUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(responseBody.updated_at).toEqual(parsedUpdatedAt);

  expect(responseBody.dependencies.database).toBeDefined();

  // Database Version
  expect(responseBody.dependencies.database.version).toBeDefined();
  expect(responseBody.dependencies.database.version).toBe("16.0");

  //Database max connections
  expect(responseBody.dependencies.database.max_connections).toBeDefined();
  expect(responseBody.dependencies.database.max_connections).toBe(100);

  //Database used connections
  expect(responseBody.dependencies.database.used_connections).toBeDefined();
  expect(responseBody.dependencies.database.used_connections).toBe(1);
});
