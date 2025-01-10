const { exec } = require("node:child_process")

const handleReturn = (_, stdout) => {
  if (stdout.search("accepting connections") === -1) {
    process.stdout.write(".")

    setTimeout(checkPostgres, 1000)
    return
  }
  console.log('\n🟢 Postgres is ready and accepting connections!\n')
}

const checkPostgres = () => {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn)

}

process.stdout.write('\n\n🔴 Waiting for Postgres to accept for connections')
checkPostgres()

