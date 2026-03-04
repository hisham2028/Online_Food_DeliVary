class DatabaseConnection {
  static #instance = null;  // Private static instance
  
  constructor() {
    if (DatabaseConnection.#instance) {
      throw new Error('Use getInstance()');
    }
  }
  
  static getInstance() {
    if (!DatabaseConnection.#instance) {
      DatabaseConnection.#instance = new DatabaseConnection();
    }
    return DatabaseConnection.#instance;
  }
}