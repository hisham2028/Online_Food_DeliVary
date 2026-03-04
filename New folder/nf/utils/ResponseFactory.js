/**
 * CREATIONAL PATTERN: Factory Method
 * Creates different types of API response objects
 */

/**
 * Abstract Product: Base Response
 */
class ApiResponse {
  constructor(success, message, data = null, statusCode = 200) {
    this.success = success;
    this.message = message;
    this.data = data;
    this.statusCode = statusCode;
    this.timestamp = new Date().toISOString();
  }

  toJSON() {
    return {
      success: this.success,
      message: this.message,
      ...(this.data && { data: this.data }),
      timestamp: this.timestamp
    };
  }

  send(res) {
    return res.status(this.statusCode).json(this.toJSON());
  }
}

/**
 * Concrete Products: Specific Response Types
 */
class SuccessResponse extends ApiResponse {
  constructor(message, data = null) {
    super(true, message, data, 200);
  }
}

class CreatedResponse extends ApiResponse {
  constructor(message, data = null) {
    super(true, message, data, 201);
  }
}

class BadRequestResponse extends ApiResponse {
  constructor(message, errors = null) {
    super(false, message, errors, 400);
  }
}

class UnauthorizedResponse extends ApiResponse {
  constructor(message = "Unauthorized access") {
    super(false, message, null, 401);
  }
}

class ForbiddenResponse extends ApiResponse {
  constructor(message = "Forbidden") {
    super(false, message, null, 403);
  }
}

class NotFoundResponse extends ApiResponse {
  constructor(message = "Resource not found") {
    super(false, message, null, 404);
  }
}

class ValidationErrorResponse extends ApiResponse {
  constructor(errors) {
    super(false, "Validation failed", { errors }, 422);
  }
}

class ServerErrorResponse extends ApiResponse {
  constructor(message = "Internal server error") {
    super(false, message, null, 500);
  }
}

/**
 * FACTORY: Creates appropriate response objects
 */
class ResponseFactory {
  /**
   * Create success response (200)
   */
  static createSuccess(message, data = null) {
    return new SuccessResponse(message, data);
  }

  /**
   * Create created response (201)
   */
  static createCreated(message, data = null) {
    return new CreatedResponse(message, data);
  }

  /**
   * Create bad request response (400)
   */
  static createBadRequest(message, errors = null) {
    return new BadRequestResponse(message, errors);
  }

  /**
   * Create unauthorized response (401)
   */
  static createUnauthorized(message) {
    return new UnauthorizedResponse(message);
  }

  /**
   * Create forbidden response (403)
   */
  static createForbidden(message) {
    return new ForbiddenResponse(message);
  }

  /**
   * Create not found response (404)
   */
  static createNotFound(message) {
    return new NotFoundResponse(message);
  }

  /**
   * Create validation error response (422)
   */
  static createValidationError(errors) {
    return new ValidationErrorResponse(errors);
  }

  /**
   * Create server error response (500)
   */
  static createServerError(message) {
    return new ServerErrorResponse(message);
  }

  /**
   * Factory method: Create response based on type
   */
  static create(type, message, data = null) {
    const factories = {
      'success': () => this.createSuccess(message, data),
      'created': () => this.createCreated(message, data),
      'badRequest': () => this.createBadRequest(message, data),
      'unauthorized': () => this.createUnauthorized(message),
      'forbidden': () => this.createForbidden(message),
      'notFound': () => this.createNotFound(message),
      'validationError': () => this.createValidationError(data),
      'serverError': () => this.createServerError(message)
    };

    const factory = factories[type];
    if (!factory) {
      throw new Error(`Unknown response type: ${type}`);
    }

    return factory();
  }
}

export default ResponseFactory;
