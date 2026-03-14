import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import { body, validationResult } from "express-validator";
import 'dotenv/config'; 
import dns from 'node:dns';
import rateLimit from "express-rate-limit";
import Database from "./config/Database.js";
import FoodRoute from "./routes/FoodRoute.js";
import UserRoute from "./routes/UserRoute.js";
import CartRoute from "./routes/CartRoute.js"; 
import OrderRoute from "./routes/OrderRoute.js";

dns.setServers(['8.8.8.8', '1.1.1.1']); 

class Server {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 4000;
    this.database = Database;
    
    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeStaticFiles();
    this.initializeTestRoute();
  }

  initializeMiddleware() {
    // Security headers with HTTPS enforcement
    this.app.use(helmet({
      hsts: {
        maxAge: 31536000, // 1 year
        includeSubDomains: true,
        preload: true
      },
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"], // Required for some CSS frameworks
          scriptSrc: ["'self'"], // No unsafe-inline for scripts
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "https://apis.google.com", "https://www.facebook.com"], // For social login
          fontSrc: ["'self'", "https:", "data:"],
          objectSrc: ["'none'"],
          mediaSrc: ["'self'"],
          frameSrc: ["'none'"],
          childSrc: ["'none'"],
          workerSrc: ["'self'"],
          manifestSrc: ["'self'"],
          upgradeInsecureRequests: [], // Force HTTPS in production
        },
      },
    }));

    // HTTPS redirect middleware
    this.app.use((req, res, next) => {
      if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
        res.redirect(`https://${req.header('host')}${req.url}`);
      } else {
        next();
      }
    });

    this.app.use(express.json());
    this.app.use(cookieParser());
    
    // Sanitize user input to prevent NoSQL injection
    this.app.use(mongoSanitize());
    
    // Global validation middleware
    this.app.use((req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ success: false, errors: errors.array() });
      }
      next();
    });
    // Configure CORS with specific origins
    const allowedOrigins = [
      'http://localhost:5173', // Vite dev server
      'http://localhost:3000', // React dev server
      'https://your-production-domain.com', // Add your production domain
      process.env.FRONTEND_URL // Environment variable for frontend URL
    ].filter(Boolean);

    this.app.use(cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, Postman, etc.)
        if (!origin) return callback(null, true);
        
        if (allowedOrigins.includes(origin)) {
          callback(null, true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true, // Required for httpOnly cookies
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      exposedHeaders: ['Set-Cookie']
    }));

    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use(limiter);
  }

  initializeRoutes() {
    this.app.use("/api/food", FoodRoute);
    this.app.use("/api/user", UserRoute);
    this.app.use("/api/cart", CartRoute);
    this.app.use("/api/order", OrderRoute);
  }

  initializeStaticFiles() {
    this.app.use("/images", express.static('uploads'));
  }

  initializeTestRoute() {
    this.app.get("/", (req, res) => {
      res.send("API Working Successfully");
    });
  }

  async start() {
    try {
      await this.database.connect();
      
      this.app.listen(this.port, () => {
        console.log(`Server Started on http://localhost:${this.port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  getApp() {
    return this.app;
  }
}

const server = new Server();
server.start();

export default server;
