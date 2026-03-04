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
  async update(event, data) {
    // Send email when order status changes
  }
}