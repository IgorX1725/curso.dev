import useSWR from "swr";

const fetchAPI = async (key) => {
  const response = await fetch(key);

  return await response.json();
};

const UpdatedAt = () => {
  const { isLoading, data } = useSWR("/api/v1/status", fetchAPI);

  let LoadingText = "Loading...";

  return isLoading ? (
    <div>{LoadingText}</div>
  ) : (
    <div>
      <p>Last update: {new Date(data.updated_at).toLocaleString("pt-BR")}</p>
      <h2>Dependencies:</h2>
      <ul>
        <li>Version: {data.dependencies.database.version}</li>
        <li>Max Connections: {data.dependencies.database.max_connections}</li>
        <li>
          Used Connections: {data.dependencies.database.used_connections}{" "}
        </li>
      </ul>
    </div>
  );
};

const StatusPage = () => {
  return (
    <>
      <h1>Status</h1>
      <UpdatedAt />
    </>
  );
};

export default StatusPage;
