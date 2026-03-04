class OrderFacade {
  constructor(orderRepo, userRepo, foodRepo) {
    this.paymentProcessor = new PaymentProcessor();
    this.notificationManager = new NotificationManager();
    this.orderBuilder = new OrderBuilder();
  }
  
  async placeOrder(orderData) {
    // Hides complexity of:
    // 1. User validation
    // 2. Item validation
    // 3. Order building
    // 4. Payment processing
    // 5. Cart clearing
    // 6. Notifications
    // All in one simple method!
  }
}