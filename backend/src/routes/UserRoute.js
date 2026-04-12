import express from "express";
import rateLimit from "express-rate-limit";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

class UserRoute {
  constructor() {
    this.router = express.Router();
    this.controller = UserController;
    this.authMiddleware = AuthMiddleware;

    // Stricter rate limit for login/register to prevent brute force
    this.authLimiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 10, // only 10 attempts per window
      standardHeaders: true,
      legacyHeaders: false,
      message: { success: false, message: "Too many attempts. Please try again in 15 minutes." }
    });

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.authLimiter, this.controller.register);
    this.router.post("/login", this.authLimiter, this.controller.login);
    this.router.get("/verify-email/:token", this.controller.verifyEmail);
    this.router.post("/forgot-password", this.authLimiter, this.controller.forgotPassword);
    this.router.post("/verify-reset-code", this.authLimiter, this.controller.verifyResetCode);
    this.router.post("/reset-password", this.authLimiter, this.controller.resetPassword);
    this.router.put("/change-password", this.authLimiter, this.authMiddleware.authenticate, this.controller.changePassword);
    this.router.get("/profile", this.authMiddleware.authenticate, this.controller.getUserProfile);
    this.router.put("/profile", this.authMiddleware.authenticate, this.controller.updateProfile);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoute().getRouter();
