/**
 * Repositories using Adapter Pattern
 */

import { MongooseAdapter } from '../adapters/RepositoryAdapter.js';
import UserModel from '../models/UserModel.js';
import FoodModel from '../models/FoodModel.js';
import OrderModel from '../models/OrderModel.js';

/**
 * User Repository
 */
class UserRepository {
  constructor() {
    this.adapter = new MongooseAdapter(UserModel);
  }

  async create(userData) {
    return await this.adapter.create(userData);
  }

  async findById(id) {
    return await this.adapter.findById(id);
  }

  async findByEmail(email) {
    return await this.adapter.findOne({ email });
  }

  async updateCart(userId, cartData) {
    return await this.adapter.update(userId, { cartData });
  }

  async clearCart(userId) {
    return await this.updateCart(userId, {});
  }

  async update(id, data) {
    return await this.adapter.update(id, data);
  }

  async delete(id) {
    return await this.adapter.delete(id);
  }
}

/**
 * Food Repository
 */
class FoodRepository {
  constructor() {
    this.adapter = new MongooseAdapter(FoodModel);
  }

  async create(foodData) {
    return await this.adapter.create(foodData);
  }

  async findById(id) {
    return await this.adapter.findById(id);
  }

  async findAll(query = {}, options = {}) {
    return await this.adapter.findAll(query, options);
  }

  async search(searchTerm) {
    return await this.adapter.getModel().find({
      $text: { $search: searchTerm }
    });
  }

  async update(id, data) {
    return await this.adapter.update(id, data);
  }

  async delete(id) {
    return await this.adapter.delete(id);
  }

  async updateAvailability(id, isAvailable) {
    return await this.update(id, { isAvailable });
  }
}

/**
 * Order Repository
 */
class OrderRepository {
  constructor() {
    this.adapter = new MongooseAdapter(OrderModel);
  }

  async create(orderData) {
    return await this.adapter.create(orderData);
  }

  async findById(id) {
    return await this.adapter.findById(id);
  }

  async findByUser(userId, options = {}) {
    return await this.adapter.findAll({ userId }, options);
  }

  async findAll(query = {}, options = {}) {
    return await this.adapter.findAll(query, options);
  }

  async update(id, data) {
    return await this.adapter.update(id, data);
  }

  async delete(id) {
    return await this.adapter.delete(id);
  }

  async updateStatus(orderId, status) {
    const updateData = { status };
    
    if (status === 'Delivered') {
      updateData.deliveredAt = new Date();
    } else if (status === 'Cancelled') {
      updateData.cancelledAt = new Date();
    }
    
    return await this.update(orderId, updateData);
  }

  async updatePaymentStatus(orderId, isPaid) {
    return await this.update(orderId, { payment: isPaid });
  }
}

export { UserRepository, FoodRepository, OrderRepository };
