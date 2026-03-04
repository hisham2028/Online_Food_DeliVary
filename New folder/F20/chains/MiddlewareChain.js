class MiddlewareHandler {
  setNext(handler) {
    this.nextHandler = handler;
    return handler;
  }
  
  async handle(req, res, next) {
    const result = await this.process(req, res);
    if (result.shouldContinue && this.nextHandler) {
      return await this.nextHandler.handle(req, res, next);
    }
  }
}

class AuthenticationHandler extends MiddlewareHandler {
  async process(req, res) {
    // Check auth
    if (valid) return { shouldContinue: true };
    return { shouldContinue: false, response: 'Unauthorized' };
  }
}