import UserModel from "../models/UserModel.js";
import bcrypt from "bcryptjs";
import validator from "validator";
import crypto from "crypto";
import AuthMiddleware from "../middleware/AuthMiddleware.js";
import EmailService from "../services/EmailService.js";

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

      // ✅ Block login if not verified
      if (!user.isVerified) {
        return res.status(401).json({ 
          success: false, 
          message: "Please verify your email before logging in. Check your inbox." 
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: "Invalid credentials" });
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

      if (password.length < 6) {
        return res.status(400).json({ success: false, message: "Enter a strong password" });
      }

      const existingUser = await this.userModel.findByEmail(email);
      if (existingUser) {
        return res.status(409).json({ success: false, message: "User Already Exists" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // ✅ Generate verification token
      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

      await this.userModel.create({
        name,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken,
        verificationTokenExpire
      });

      // ✅ Send verification email
      await EmailService.sendVerificationEmail(email, verificationToken);

      res.json({ 
        success: true, 
        message: "Registration successful! Please check your email to verify your account." 
      });
    } catch (error) {
      console.error("REGISTER ERROR:", error);
      res.status(500).json({ success: false, message: "Server Error" });
    }
  }

  // ✅ New — verify email endpoint
  verifyEmail = async (req, res) => {
    try {
      const { token } = req.params;

      const user = await this.userModel.findByVerificationToken(token);
      if (!user) {
        return res.status(400).send(`
          <html><body style="font-family:Arial;text-align:center;padding:50px">
            <h2 style="color:red">Invalid or expired verification link.</h2>
            <p>Please register again.</p>
          </body></html>
        `);
      }

      await this.userModel.updateById(user._id, {
        isVerified: true,
        verificationToken: null,
        verificationTokenExpire: null
      });

      // ✅ Redirect to frontend login page after verification
      res.redirect(`${process.env.FRONTEND_URL}/login?verified=true`);
    } catch (error) {
      console.error("VERIFY EMAIL ERROR:", error);
      res.status(500).send('<h2>Server error. Please try again.</h2>');
    }
  }

  // ✅ New — resend verification email
  resendVerification = async (req, res) => {
    try {
      const { email } = req.body;
      const user = await this.userModel.findByEmail(email);

      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }

      if (user.isVerified) {
        return res.json({ success: false, message: "Email already verified" });
      }

      const verificationToken = crypto.randomBytes(32).toString('hex');
      const verificationTokenExpire = Date.now() + 24 * 60 * 60 * 1000;

      await this.userModel.updateById(user._id, { verificationToken, verificationTokenExpire });
      await EmailService.sendVerificationEmail(email, verificationToken);

      res.json({ success: true, message: "Verification email resent. Please check your inbox." });
    } catch (error) {
      console.error("RESEND VERIFICATION ERROR:", error);
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
}

export default new UserController();