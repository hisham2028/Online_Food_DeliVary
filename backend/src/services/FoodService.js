import { v2 as cloudinary } from 'cloudinary';
import FoodModel from '../models/FoodModel.js';

class FoodService {
  constructor(foodModel = null) {
    this.foodModel = foodModel || FoodModel;
  }

  async addFood(foodData, imageFile) {
    if (!foodData.name || !foodData.price || !imageFile) {
      throw new Error('Name, price, and image are required');
    }

    const newFood = await this.foodModel.create({
      name:        foodData.name,
      description: foodData.description || '',
      price:       Number(foodData.price),
      category:    foodData.category || 'other',
      image:       imageFile.path,   // ✅ was imageFile.filename
      isAvailable: foodData.isAvailable !== undefined ? foodData.isAvailable : true
    });

    return newFood;
  }

  async updateFood(foodId, updateData, imageFile) {
    const food = await this.foodModel.findById(foodId);
    if (!food) throw new Error('Food item not found');

    const updates = { ...updateData };

    if (imageFile) {
      await this._deleteImage(food.image);
      updates.image = imageFile.path;  // ✅ was imageFile.filename
    }

    if (updates.price) updates.price = Number(updates.price);

    return await this.foodModel.update(foodId, updates);
  }

  async deleteFood(foodId) {
    const food = await this.foodModel.findById(foodId);
    if (!food) throw new Error('Food item not found');

    await this._deleteImage(food.image);
    await this.foodModel.delete(foodId);

    return { message: 'Food item deleted successfully' };
  }

  // ✅ Now deletes from Cloudinary instead of local disk
  async _deleteImage(imageUrl) {
    if (!imageUrl) return;
    try {
      const urlParts = imageUrl.split('/');
      const publicId = 'food-delivery/' + urlParts[urlParts.length - 1].split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    } catch (error) {
      console.error('Error deleting image from Cloudinary:', error);
    }
  }

  // These methods stay exactly the same
  async getAllFoods(filters = {}) {
    const query = {};
    if (filters.category)              query.category    = filters.category;
    if (filters.isAvailable !== undefined) query.isAvailable = filters.isAvailable;
    const options = {
      sort:  filters.sort  || { createdAt: -1 },
      limit: filters.limit,
      skip:  filters.skip
    };
    return await this.foodModel.findAll(query, options);
  }

  async getFoodById(foodId) {
    const food = await this.foodModel.findById(foodId);
    if (!food) throw new Error('Food item not found');
    return food;
  }

  async searchFoods(searchTerm) {
    if (!searchTerm || searchTerm.trim().length === 0) return [];
    return await this.foodModel.search(searchTerm);
  }
}

export default FoodService;