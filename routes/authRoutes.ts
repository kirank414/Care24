import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate JWT
const generateToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "care24_super_secret_key_123", {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post("/signup", async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const safeEmail = email.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const userExists = await User.findOne({ email: { $regex: new RegExp(`^${safeEmail}$`, "i") } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email: email.trim(),
      password,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const safeEmail = email.trim().replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const user: any = await User.findOne({ email: { $regex: new RegExp(`^${safeEmail}$`, "i") } }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id.toString()),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get("/me", protect, async (req: any, res) => {
  res.json(req.user);
});

export default router;
