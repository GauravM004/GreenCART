import jwt from "jsonwebtoken";
import * as userService from "../services/userService.js";

/**
 * Authenticate User Middleware
 * Verifies JWT token from Authorization header or cookies
 * Attaches user to req.user and userId to req.userId
 */
const authenticateUser = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization Header (Bearer token from frontend)
    if (req.headers.authorization) {
      const headerParts = req.headers.authorization.split(" ");
      if (headerParts.length !== 2 || headerParts[0] !== "Bearer") {
        return res.status(401).json({
          success: false,
          message: "Invalid Authorization header format",
        });
      }
      token = headerParts[1];
    }

    // 2️⃣ If not found, check cookies (backward compatibility)
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Please login.",
      });
    }

    // 3️⃣ Verify JWT
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (jwtError) {
      if (jwtError.name === "TokenExpiredError") {
        return res.status(401).json({
          success: false,
          message: "Token expired. Please login again.",
        });
      }
      return res.status(401).json({
        success: false,
        message: "Invalid token.",
      });
    }

    // 4️⃣ Find user in database
    const user = await userService.findUserById(decoded.userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found.",
      });
    }

    // 5️⃣ Attach user to request object
    req.user = user;
    req.userId = user.id;

    next();
  } catch (error) {
    console.error("Auth Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Authentication failed.",
    });
  }
};

export default authenticateUser;
