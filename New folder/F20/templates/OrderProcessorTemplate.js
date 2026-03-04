class OrderProcessorTemplate {
  // Template Method - cannot be overridden
  async processOrder(orderData) {
    await this.validateOrder(orderData);
    const pricing = await this.calculatePricing(orderData);
    await this.processPayment(pricing, orderData);
    return await this.createOrder(orderData);
  }
  
  // Primitive operations - can be overridden
  async validateOrder(orderData) { /* default */ }
  async processPayment(pricing, orderData) { throw new Error('Implement'); }
}

class CODOrderProcessor extends OrderProcessorTemplate {
  async processPayment(pricing, orderData) {
    // COD-specific payment
    return { method: 'cod', paid: false };
  }
  
  // Override pricing calculation
  async calculatePricing(orderData) {
    // No tax for COD
    return { total: orderData.amount };
  }
}