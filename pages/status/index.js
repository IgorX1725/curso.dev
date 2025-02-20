import useSWR from "swr";

const fetchAPI = async (key) => {
  const response = await fetch(key);

  return await response.json();
};

const UpdatedAt = ({ date }) => {
  return (
    <div>
      <p>Last update: {new Date(date).toLocaleString("pt-BR")}</p>
    </div>
  );
};

const DatabaseStatus = ({ databaseStatus }) => {
  return (
    <>
      <h1>Database:</h1>
      <div>Version: {databaseStatus.version}</div>
      <div>Max Connections: {databaseStatus.max_connections}</div>
      <div>Used Connections: {databaseStatus.used_connections} </div>
    </>
  );
};

const StatusPage = () => {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);
  const LoadingText = "Loading...";

  return isLoading ? (
    <div>{LoadingText}</div>
  ) : (
    <>
      <h1>Status</h1>
      <UpdatedAt date={data.updated_at} />
      <DatabaseStatus databaseStatus={data.dependencies.database} />
    </>
  );
};

export default StatusPage;
