class ResponseFactory {
  static createSuccess(message, data) {
    return new SuccessResponse(message, data);
  }
  
  static createNotFound(message) {
    return new NotFoundResponse(message);
  }
  
  // Factory method - creates based on type
  static create(type, message, data) {
    const factories = {
      'success': () => this.createSuccess(message, data),
      'notFound': () => this.createNotFound(message),
      // ...
    };
    return factories[type]();
  }
}