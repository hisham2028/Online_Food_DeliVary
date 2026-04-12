import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import crypto from "node:crypto";
import EmailService from "../services/EmailService.js";

class UserController {
  constructor() {
    this.userModel = UserModel;
    this.authMiddleware = AuthMiddleware;
    this.emailService = EmailService;
  }

  normalizeEmail = (email) => email.trim().toLowerCase();

  validatePassword = (password) => password && password.length >= 8;

  login = async (req, res) => {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: "Please provide email and password" });
      }

      const user = await this.userModel.findByEmail(this.normalizeEmail(email));
      if (!user) {
        return res.status(401).json({ success: false, message: "User does not exist" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Please verify your email before logging in. Check your inbox for the verification link."
        });
      }

      const token = this.authMiddleware.generateToken(user._id);
      res.json({ success: true, token });
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

      if (!this.validatePassword(password)) {
        return res.status(400).json({ success: false, message: "Password must be at least 8 characters" });
      }

      const normalizedEmail = this.normalizeEmail(email);
      const existingUser = await this.userModel.findByEmail(normalizedEmail);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User Already Exists" });
      }
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const hashedVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
      const verificationTokenExpire = new Date(Date.now() + 24 * 60 * 60 * 1000);

      await this.userModel.create({
        name: name.trim(),
        email: normalizedEmail,
        password: hashedPassword,
        isVerified: false,
        verificationToken: hashedVerificationToken,
        verificationTokenExpire
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const verificationUrl = `${process.env.BACKEND_URL || 'http://localhost:4000'}/api/user/verify-email/${verificationToken}`;
      await this.emailService.sendVerificationEmail(normalizedEmail, verificationUrl, frontendUrl);

      res.json({
        success: true,
        message: "Registration successful! Please check your email to verify your account."
      });
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

  verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;

      if (!token) {
        return res.status(400).json({ success: false, message: 'Verification token is required' });
      }

      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await this.userModel.getModel().findOne({
        verificationToken: hashedToken,
        verificationTokenExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Verification link is invalid or has expired' });
      }

      await this.userModel.updateById(user._id, {
        isVerified: true,
        verificationToken: undefined,
        verificationTokenExpire: undefined,
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      return res.redirect(`${frontendUrl}/?verified=true`);
    } catch (error) {
      console.error('VERIFY EMAIL ERROR:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  forgotPassword = async (req, res) => {
    try {
      const { email } = req.body;

      if (!email || !validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: "Please provide a valid email" });
      }

      const normalizedEmail = this.normalizeEmail(email);
      const user = await this.userModel.findByEmail(normalizedEmail);
      if (!user) {
        return res.status(404).json({ success: false, message: "No account found for this email" });
      }

      const resetToken = crypto.randomBytes(32).toString('hex');
      const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
      const resetPasswordExpire = new Date(Date.now() + 60 * 60 * 1000);

      await this.userModel.updateById(user._id, {
        resetPasswordToken: hashedToken,
        resetPasswordExpire,
      });

      const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      const resetUrl = `${frontendUrl}/reset-password?token=${resetToken}&email=${encodeURIComponent(normalizedEmail)}`;
      await this.emailService.sendPasswordResetEmail(normalizedEmail, resetUrl);

      return res.json({
        success: true,
        message: 'Password reset link has been sent to your email address.'
      });
    } catch (error) {
      console.error('FORGOT PASSWORD ERROR:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  resetPassword = async (req, res) => {
    try {
      const { email, token, password, confirmPassword } = req.body;

      if (!email || !token || !password || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
      }

      if (!validator.isEmail(email)) {
        return res.status(400).json({ success: false, message: 'Please provide a valid email' });
      }

      if (!this.validatePassword(password)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }

      if (password !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
      }

      const normalizedEmail = this.normalizeEmail(email);
      const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
      const user = await this.userModel.getModel().findOne({
        email: normalizedEmail,
        resetPasswordToken: hashedToken,
        resetPasswordExpire: { $gt: Date.now() }
      });

      if (!user) {
        return res.status(400).json({ success: false, message: 'Reset link is invalid or has expired' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await this.userModel.updateById(user._id, {
        password: hashedPassword,
        resetPasswordToken: undefined,
        resetPasswordExpire: undefined,
      });

      return res.json({ success: true, message: 'Password updated successfully. You can now login.' });
    } catch (error) {
      console.error('RESET PASSWORD ERROR:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }

  changePassword = async (req, res) => {
    try {
      const { currentPassword, newPassword, confirmPassword } = req.body;

      if (!currentPassword || !newPassword || !confirmPassword) {
        return res.status(400).json({ success: false, message: 'Please provide all required fields' });
      }

      if (!this.validatePassword(newPassword)) {
        return res.status(400).json({ success: false, message: 'Password must be at least 8 characters' });
      }

      if (newPassword !== confirmPassword) {
        return res.status(400).json({ success: false, message: 'Passwords do not match' });
      }

      const user = await this.userModel.findById(req.body.userId);
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'Current password is incorrect' });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      await this.userModel.updateById(user._id, { password: hashedPassword });

      return res.json({ success: true, message: 'Password changed successfully' });
    } catch (error) {
      console.error('CHANGE PASSWORD ERROR:', error);
      res.status(500).json({ success: false, message: 'Server Error' });
    }
  }
}

export default new UserController();