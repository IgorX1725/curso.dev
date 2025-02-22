export class InternalServerError extends Error {
  constructor({ cause }) {
    super("An unexpected internal error happened.", {
      cause,
    });
    this.name = "InternalServerError";
    this.action = "Please reach out to our support team.";
    this.statuscode = 500;
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      action: this.action,
      status_code: this.statuscode,
    };
  }
}
