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
    let finalEmail = email ? email.trim().toLowerCase() : undefined;

    // Check if user is authenticated (optional token check)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.split(" ")[1];
      try {
        const decoded: any = jwt.verify(token, process.env.JWT_SECRET || "secret");
        const user = await User.findById(decoded.id);
        if (user) {
          userId = user._id;
          finalEmail = user.email ? user.email.toLowerCase().trim() : undefined;
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
      status: "Open",
    });

    // Notify all admin users
    try {
      const admins = await User.find({ role: "admin" });
      const submitterName = userId ? (await User.findById(userId))?.name : "Guest";
      for (const admin of admins) {
        await Notification.create({
          user: admin._id,
          type: "new_message",
          title: "New Support Request",
          message: `Support request submitted by ${submitterName} (${finalEmail}): "${question.substring(0, 30)}..."`,
          relatedId: inquiry._id,
          relatedModel: "Inquiry"
        });
      }
    } catch (notifErr) {
      console.error("Failed to notify admins on inquiry submission:", notifErr);
    }

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
  console.log(`Received answer request for inquiry ${req.params.id} with body:`, req.body);
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
    inquiry.status = "Resolved";
    await inquiry.save();

    // If inquiry was submitted by a registered user, send a notification
    if (inquiry.user) {
      await createNotification(
        inquiry.user.toString(),
        "admin_message",
        "Your Question has been Answered!",
        `Our team has answered your question: "${inquiry.question?.substring(0, 40) || ''}..."\n\nAnswer: ${answer}`
      );
    }

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id/status
// @access  Private (Admin)
router.put("/:id/status", protect, authorize("admin"), async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !["Open", "In Progress", "Resolved"].includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const inquiry = await Inquiry.findById(req.params.id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    if (status === "Resolved" && (!inquiry.answer || inquiry.answer.trim() === "")) {
      return res.status(400).json({ message: "Cannot resolve inquiry without providing an answer first." });
    }

    inquiry.status = status;
    await inquiry.save();

    res.json(inquiry);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
