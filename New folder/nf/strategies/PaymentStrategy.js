// Strategy Interface
class PaymentStrategy {
  async processPayment(orderData) { throw new Error('Implement me'); }
}

// Concrete Strategy 1
class CODStrategy extends PaymentStrategy {
  async processPayment(orderData) {
    return { method: 'cod', paid: false };
  }
}

// Concrete Strategy 2
class StripeStrategy extends PaymentStrategy {
  async processPayment(orderData) {
    const session = await this.stripe.checkout.sessions.create(/* ... */);
    return { method: 'stripe', sessionUrl: session.url };
  }
}

// Context
class PaymentProcessor {
  setStrategy(method) {
    this.currentStrategy = this.strategies[method];
    return this;
  }
  
  async processPayment(orderData) {
    return await this.currentStrategy.processPayment(orderData);
  }
}