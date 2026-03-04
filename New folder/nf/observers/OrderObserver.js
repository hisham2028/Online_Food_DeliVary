// Subject
class OrderSubject {
  constructor() {
    this.observers = [];
  }
  
  attach(observer) {
    this.observers.push(observer);
  }
  
  async notify(event, data) {
    for (const observer of this.observers) {
      await observer.update(event, data);
    }
  }
  
  async setState(newState, orderData) {
    await this.notify('stateChange', { state: newState, order: orderData });
  }
}

// Observer
class EmailNotificationObserver {
  constructor() {
    // Import here to avoid circular dependencies or lazy load
  }

  async update(event, data) {
    if (event === 'stateChange') {
      const { state, order } = data;
      // Dynamically import to avoid issues
      const { default: UserModel } = await import('../src/models/UserModel.js');
      const { default: EmailService } = await import('../src/services/EmailService.js');

      try {
        const user = await UserModel.findById(order.userId);
        if (user && user.email) {
          await EmailService.sendOrderStatusUpdate(user.email, order._id, state);
        }
      } catch (error) {
        console.error('Error sending order status email:', error);
      }
    }
  }
}