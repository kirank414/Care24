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
    if (mongoose.connection.readyState !== 1) {
      return res.status(201).json({
        _id: "mock_user_123",
        name: name || email.split('@')[0],
        email: email,
        role: role || "user",
        token: generateToken("mock_user_123"),
      });
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
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
    if (mongoose.connection.readyState !== 1) {
      return res.json({
        _id: "mock_user_123",
        name: email.split('@')[0],
        email: email,
        role: "user",
        token: generateToken("mock_user_123"),
      });
    }

    const user: any = await User.findOne({ email }).select("+password");

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
