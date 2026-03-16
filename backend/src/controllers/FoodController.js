import { v2 as cloudinary } from 'cloudinary';
import FoodModel from "../models/FoodModel.js";

class FoodController {
  constructor() {
    this.foodModel = FoodModel;
  }

  addFood = async (req, res) => {
    try {
      if (!req.body.name || !req.body.price || !req.file) {
        return res.status(400).json({ 
          success: false, 
          message: "Missing required fields: name, price, and image are required" 
        });
      }

      const food = await this.foodModel.create({
        name:        req.body.name,
        description: req.body.description || '',
        price:       Number(req.body.price),
        category:    req.body.category || 'other',
        image:       req.file.path,   // ✅ full Cloudinary URL
        isAvailable: req.body.isAvailable !== undefined ? req.body.isAvailable : true
      });
      
      res.status(201).json({ 
        success: true, 
        message: "Food item added successfully",
        data: food
      });
    } catch (error) {
      console.error("Error adding food item:", error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: "Validation error", errors: messages });
      }
      res.status(500).json({ success: false, message: "Server error while adding food item" });
    }
  }

  listFood = async (req, res) => {
    try {
      const foods = await this.foodModel.findAll();
      res.json({ success: true, data: foods });
    } catch (error) {
      console.error("Error fetching foods:", error);
      res.status(500).json({ success: false, message: "Error fetching food items" });
    }
  }

  updateFood = async (req, res) => {
    try {
      const updates = { ...req.body };
      
      if (req.file) {
        updates.image = req.file.path;  // ✅ full Cloudinary URL
      }
      
      if (updates.price) {
        updates.price = Number(updates.price);
      }

      const food = await this.foodModel.updateById(req.params.id, updates);

      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }

      res.status(200).json({ success: true, message: "Food item updated successfully", data: food });
    } catch (error) {
      console.error("Error updating food item:", error);
      if (error.name === 'ValidationError') {
        const messages = Object.values(error.errors).map(val => val.message);
        return res.status(400).json({ success: false, message: "Validation error", errors: messages });
      }
      res.status(500).json({ success: false, message: "Error updating food item" });
    }
  }

  removeFood = async (req, res) => {
    try {
      if (!req.body.id) {
        return res.status(400).json({ success: false, message: "Food ID is required" });
      }

      const food = await this.foodModel.findById(req.body.id);
      if (!food) {
        return res.status(404).json({ success: false, message: "Food item not found" });
      }

      // ✅ Delete image from Cloudinary
      if (food.image) {
        try {
          const urlParts = food.image.split('/');
          const publicId = 'food-delivery/' + urlParts[urlParts.length - 1].split('.')[0];
          await cloudinary.uploader.destroy(publicId);
        } catch (err) {
          console.error('Cloudinary delete error:', err);
          // Don't block food deletion if image cleanup fails
        }
      }

      await this.foodModel.deleteById(req.body.id);
      res.json({ success: true, message: "Food item removed successfully" });
    } catch (error) {
      console.error("Error deleting food item:", error);
      res.status(500).json({ success: false, message: "Error deleting food item" });
    }
  }

  searchFood = async (req, res) => {
    try {
      const { query } = req.query;
      const foods = await this.foodModel.search(query);
      res.json({ success: true, data: foods });
    } catch (error) {
      console.error("Error searching foods:", error);
      res.status(500).json({ success: false, message: "Error searching food items" });
    }
  }
}

export default new FoodController();