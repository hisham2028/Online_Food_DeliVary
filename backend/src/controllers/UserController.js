import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import { body } from "express-validator";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

class UserController {
  constructor() {
    this.userModel = UserModel;
    this.authMiddleware = AuthMiddleware;
  }

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }

      const user = await this.userModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ success: false, message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      const token = this.authMiddleware.generateToken(user._id);
      
      // Set httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ success: true, message: "Login successful" });
    } catch (error) {
      console.error("LOGIN ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  register = async (req, res) => {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Please provide name, email and password" });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Enter a Valid Email" });
      }

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Enter a strong password" });
      }

      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User Already Exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = await this.userModel.create({
        name,
        email,
        password: hashedPassword,
      });

      const token = this.authMiddleware.generateToken(newUser._id);
      
      // Set httpOnly cookie
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.json({ success: true, message: "Registration successful" });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  getUserProfile = async (req, res) => {
    try {
      const user = await this.userModel.findById(req.body.userId);
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      
      const { password, ...userWithoutPassword } = user.toObject();
      res.json({ success: true, data: userWithoutPassword });
    } catch (error) {
      console.error("GET PROFILE ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  logout = async (req, res) => {
    try {
      // Clear the cookie
      res.cookie('token', '', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 0 // Immediately expire
      });
      
      res.json({ success: true, message: "Logout successful" });
    } catch (error) {
      console.error("LOGOUT ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  updateProfile = async (req, res) => {
    try {
      const { name } = req.body;

      if (!name || !name.trim()) {
        return res.status(400).json({ success: false, message: "Name is required" });
      }

      const updatedUser = await this.userModel.updateById(req.body.userId, { name: name.trim() });
      if (!updatedUser) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      const { password, ...userWithoutPassword } = updatedUser.toObject();
      res.json({ success: true, message: "Profile updated successfully", data: userWithoutPassword });
    } catch (error) {
      console.error("UPDATE PROFILE ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }
}

export default new UserController();
