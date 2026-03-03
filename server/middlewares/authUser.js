import jwt from "jsonwebtoken";
import User from "../models/User.js";

const authUser = async (req, res, next) => {
  try {
    let token;

    // 1️⃣ Check Authorization Header (JWT / OAuth flow)
    if (req.headers.authorization) {
      token = req.headers.authorization.split(" ")[1];
    }

    // 2️⃣ If not found, check cookies (old session flow)
    if (!token && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Not Authorized",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId || decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    req.user = user;
    req.body.userId = user._id;

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Invalid Token",
    });
  }
};

export default authUser;
