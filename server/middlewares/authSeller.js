import jwt from "jsonwebtoken";

/**
 * Verify Seller Middleware
 * Checks seller JWT token and verifies seller email matches env config
 * Attaches seller to req.seller
 */
const verifySeller = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization Header (Bearer token - consistent with user auth)
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
    if (!token && req.cookies.sellerToken) {
      token = req.cookies.sellerToken;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "No token provided. Seller login required.",
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

    // 4️⃣ Verify seller email matches authorised seller
    if (decoded.email !== process.env.SELLER_EMAIL) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized seller.",
      });
    }

    // 5️⃣ Attach seller info to request
    req.seller = { email: decoded.email };

    next();
  } catch (error) {
    console.error("Seller Auth Error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Seller authentication failed.",
    });
  }
};

export default verifySeller;