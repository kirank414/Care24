import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import User from "../models/User.js"; // Note: .js extension for ES modules if needed, or tsx handles it

interface AuthRequest extends Request {
  user?: any;
}

// Protect routes
export const protect = async (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      if (!process.env.JWT_SECRET) {
        return res.status(500).json({ message: "JWT_SECRET environment variable is not set" });
      }
      const decoded: any = jwt.verify(token, process.env.JWT_SECRET);

      // Get user from the token
      if (!mongoose.Types.ObjectId.isValid(decoded.id)) {
        return res.status(401).json({ message: "Not authorized, invalid token payload" });
      }

      req.user = await User.findById(decoded.id).select("-password");
      if (!req.user) {
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      next();
    } catch (error) {
      console.error(error);
      res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  if (!token) {
    res.status(401).json({ message: "Not authorized, no token" });
  }
};

// Grant access to specific roles
export const authorize = (...roles: string[]) => {
  return (req: AuthRequest, res: Response, next: NextFunction) => {
    const userRole = req.user?.role?.toLowerCase();
    const authorizedRoles = roles.map(r => r.toLowerCase());

    if (!req.user || !authorizedRoles.includes(userRole)) {
      return res.status(403).json({
        message: `User role ${req.user?.role} is not authorized to access this route`,
      });
    }
    next();
  };
};
