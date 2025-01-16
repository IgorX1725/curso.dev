import retry from "async-retry";

const fetchStatusPage = async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  if (response.status !== 200) {
    throw new Error();
  }
};

const waitForWebServer = async () => {
  return retry(fetchStatusPage, {
    retries: 100,
    maxTimeout: 1000,
  });
};

const waitForAllServices = async () => {
  await waitForWebServer();
};

export default { waitForAllServices };
