import express from "express";
import rateLimit from "express-rate-limit";
import UserController from "../controllers/UserController.js";
import AuthMiddleware from "../middleware/AuthMiddleware.js";

class UserRoute {
  constructor() {
    this.router = express.Router();
    this.controller = UserController;
    this.authMiddleware = AuthMiddleware;

    // Removed login/register rate limiter

    this.initializeRoutes();
  }

  initializeRoutes() {
    this.router.post("/register", this.controller.register);
    this.router.post("/login", this.controller.login);
    this.router.get("/profile", this.authMiddleware.authenticate, this.controller.getUserProfile);
    this.router.put("/profile", this.authMiddleware.authenticate, this.controller.updateProfile);
  }

  getRouter() {
    return this.router;
  }
}

export default new UserRoute().getRouter();
