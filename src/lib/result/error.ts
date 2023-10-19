export class UserError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    this.name = 'UserError';
  }
}
