export class AuthRequiredError extends Error {
  constructor(message = "Authentication is required to perform this action") {
    super(message);
    this.name = "AuthRequiredError";
  }
}
