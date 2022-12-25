class ApplicationError extends Error {
  status: number;
  constructor(message: string) {
    super(message);
    this.name = this.constructor.name;
    this.status = 500;
  }
}
class DuplicationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 409;
  }
}
class MethodNotAllowed extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 405;
  }
}

class ValidationError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 422;
  }
}

class NotFoundError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 404;
  }
}

class ForbiddenError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 403;
  }
}

class UnauthorizedError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}

class TokenExpiredError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}

class JsonWebTokenError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 401;
  }
}

class UnCaughtError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 500;
  }
}

class BadRequestError extends ApplicationError {
  constructor(message: string) {
    super(message);
    this.status = 400;
  }
}

export {
  ApplicationError,
  ValidationError,
  NotFoundError,
  ForbiddenError,
  UnauthorizedError,
  UnCaughtError,
  BadRequestError,
  TokenExpiredError,
  MethodNotAllowed,
  JsonWebTokenError,
  DuplicationError,
};
