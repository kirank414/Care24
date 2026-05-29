import express from "express";
import jwt from "jsonwebtoken";
import Inquiry from "../models/Inquiry.js";
import User from "../models/User.js";
import { protect, authorize } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// Helper: Create a notification
async function createNotification(userId: string, type: any, title: string, message: string) {
  try {
    await Notification.create({ user: userId, type, title, message });
  } catch (e) {
    console.error("Notification creation failed:", e);
  }
}

// @desc    Submit a new inquiry (FAQ question)
// @route   POST /api/inquiries
// @access  Public (Guest or Authenticated User)
router.post("/", async (req, res) => {
  try {
    const { question, email } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question content is required" });
    }

    let userId = null;
    let finalEmail = email;

    // Check if user is authenticated (optional token check)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const user = await User.findById(decoded.id);
        if (user) {
          userId = user._id;
          finalEmail = user.email;
        }
      } catch (err) {
        // Token verification failed, treat as guest if email is provided
      }
    }

    if (!userId && !finalEmail) {
      return res.status(400).json({ message: "Please provide an email address for guest submissions" });
    }

    const inquiry = await Inquiry.create({
      user: userId,
      email: finalEmail,
      question,
      status: "pending",
    });

    res.status(201).json(inquiry);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get current user's inquiries
// @route   GET /api/inquiries/my
// @access  Private (Authenticated User)
router.get("/my", protect, async (req: any, res) => {
  try {
    const inquiries = await Inquiry.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all inquiries
// @route   GET /api/inquiries
// @access  Private (Admin)
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const inquiries = await Inquiry.find({})
      .populate("user", "name email role")
      .sort({ createdAt: -1 });
    res.json(inquiries);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Answer an inquiry
// @route   PUT /api/inquiries/:id/answer
// @access  Private (Admin)
router.put("/:id/answer", protect, authorize("admin"), async (req, res) => {
  try {
    const { answer } = req.body;

    if (!answer) {
      return res.status(400).json({ message: "Answer content is required" });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    inquiry.answer = answer;
    inquiry.status = "answered";
    await inquiry.save();

    // If inquiry was submitted by a registered user, send a notification
    if (inquiry.user) {
      await createNotification(
        inquiry.user.toString(),
        "new_message",
        "Your Question has been Answered!",
        `Our care concierge team has answered your question: "${inquiry.question.substring(0, 40)}..."`
      );
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
