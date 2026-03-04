import jwt from "jsonwebtoken";

class AuthMiddleware {
  constructor() {
    this.secretKey = process.env.JWT_SECRET;
  }

  authenticate = async (req, res, next) => {
    const { token } = req.headers;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again." });
    }

    try {
      const token_decode = jwt.verify(token, this.secretKey);
      req.body.userId = token_decode.id;
      next();
    } catch (error) {
      console.log(error);
      res.json({ success: false, message: "Error" });
    }
  }

  generateToken(id) {
    return jwt.sign({ id }, this.secretKey, { expiresIn: "7d" });
  }

  verifyToken(token) {
    try {
      return jwt.verify(token, this.secretKey);
    } catch (error) {
      return null;
    }
  }
}

export default new AuthMiddleware();
