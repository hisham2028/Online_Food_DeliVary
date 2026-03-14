import jwt from "jsonwebtoken";

class AuthMiddleware {
  constructor() {
    // Remove secretKey capture - read lazily instead
  }

  authenticate = async (req, res, next) => {
    // Try to get token from cookie first, then fallback to header for backward compatibility
    const token = req.cookies?.token || req.headers.token;

    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
      const token_decode = jwt.verify(token, process.env.JWT_SECRET);
      req.body.userId = token_decode.id;
      next();
    } catch (error) {
      console.log(error);
      res.status(401).json({ success: false, message: "Token expired or invalid. Please login again." });
    }
  }

  generateToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return null;
    }
  }
}

export default new AuthMiddleware();
