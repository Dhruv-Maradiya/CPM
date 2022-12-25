"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JsonWebTokenError = exports.MethodNotAllowed = exports.TokenExpiredError = exports.BadRequestError = exports.UnCaughtError = exports.UnauthorizedError = exports.ForbiddenError = exports.NotFoundError = exports.ValidationError = exports.ApplicationError = void 0;
class ApplicationError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        this.status = 500;
    }
}
exports.ApplicationError = ApplicationError;
class MethodNotAllowed extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 405;
    }
}
exports.MethodNotAllowed = MethodNotAllowed;
class ValidationError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 422;
    }
}
exports.ValidationError = ValidationError;
class NotFoundError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 404;
    }
}
exports.NotFoundError = NotFoundError;
class ForbiddenError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 403;
    }
}
exports.ForbiddenError = ForbiddenError;
class UnauthorizedError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
exports.UnauthorizedError = UnauthorizedError;
class TokenExpiredError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
exports.TokenExpiredError = TokenExpiredError;
class JsonWebTokenError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 401;
    }
}
exports.JsonWebTokenError = JsonWebTokenError;
class UnCaughtError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 500;
    }
}
exports.UnCaughtError = UnCaughtError;
class BadRequestError extends ApplicationError {
    constructor(message) {
        super(message);
        this.status = 400;
    }
}
exports.BadRequestError = BadRequestError;
