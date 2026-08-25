

import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import { isAuth, login, logout, register, updateProfile } from "../controllers/userController.js";
import authenticateUser from "../middlewares/authUser.js";

const userRouter = express.Router();

userRouter.post("/register", register);
userRouter.post("/login", login);
userRouter.get("/is-auth", authenticateUser, isAuth);
userRouter.get("/logout", authenticateUser, logout);
userRouter.put("/update-profile", authenticateUser, updateProfile);

// Google OAuth
userRouter.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

userRouter.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  async (req, res) => {
    const token = jwt.sign(
      { userId: req.user.id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.redirect(`http://localhost:5173/oauth-success?token=${token}`);
  }
);

export default userRouter;

