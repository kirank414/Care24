import express from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

function toProperCase(str: string): string {
  if (!str) return str;
  return str
    .split(/\s+/)
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

// Generate JWT
const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET environment variable is not set");
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

// @desc    Register a new user
// @route   POST /api/auth/signup
// @access  Public
router.post("/signup", async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    if (!email || !name || !phone) {
      return res.status(400).json({ message: "Name, email, and phone are required" });
    }

    // Security: Validate role to prevent admin account creation through public signup
    const validRoles = ["user", "caregiver"];
    if (role && !validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role specified" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedName = toProperCase(name.trim());
    const normalizedPhone = phone.trim();

    const safeEmail = normalizedEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    const userExists = await User.findOne({ email: { $regex: new RegExp(`^${safeEmail}$`, "i") } });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name: normalizedName,
      email: normalizedEmail,
      password,
      phone: normalizedPhone,
      role: role || "user",
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
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
    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }
    const normalizedEmail = email.trim().toLowerCase();
    const safeEmail = normalizedEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
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
