import express from "express";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// @desc    Get all users
// @route   GET /api/users/all
// @access  Private/Admin
router.get("/all", protect, authorize("admin"), async (req: any, res: any) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Delete user
// @route   DELETE /api/users/:id
// @access  Private/Admin
router.delete("/:id", protect, authorize("admin"), async (req: any, res: any) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "User removed successfully" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
router.put("/profile", protect, async (req: any, res: any) => {
  try {
    const user: any = await User.findById(req.user._id);

    if (user) {
      if (req.body.email) {
        const normalizedEmail = req.body.email.trim().toLowerCase();
        // Check for uniqueness if email changed
        if (normalizedEmail !== user.email) {
           const safeEmail = normalizedEmail.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
           const userExists = await User.findOne({ email: { $regex: new RegExp(`^${safeEmail}$`, "i") } });
           if (userExists) {
             return res.status(400).json({ message: "Email is already in use by another account" });
           }
        }
        user.email = normalizedEmail;
      }
      
      if (req.body.phone) {
        user.phone = req.body.phone.trim();
      }

      if (req.body.password) {
        // Basic password strength validation
        if (req.body.password.length < 6) {
           return res.status(400).json({ message: "Password must be at least 6 characters" });
        }
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
