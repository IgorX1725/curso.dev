import { InternalServerError, MethodNotAllowedError } from "infra/errors";

const onNoMatchHandler = (req, res) => {
  const publicErrorObject = new MethodNotAllowedError();
  res.status(publicErrorObject.statusCode).json(publicErrorObject);
};

const onErrorHandler = (error, req, res) => {
  const publicErrorObject = new InternalServerError({
    cause: error,
    statusCode: error.statusCode,
  });

  console.error(publicErrorObject);

  res.status(publicErrorObject.statusCode).json(publicErrorObject);
};

const controller = {
  errorHandlers: {
    onNoMatch: onNoMatchHandler,
    onError: onErrorHandler,
  },
};

export default controller;
