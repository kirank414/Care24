import express from "express";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import Notification from "../models/Notification.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Helper: Create a notification
async function createNotification(
  userId: string,
  type: any,
  title: string,
  message: string,
  relatedId?: string,
  relatedModel?: string
) {
  try {
    await Notification.create({ user: userId, type, title, message, relatedId, relatedModel });
  } catch (e) {
    console.error("Notification creation failed:", e);
  }
}


// @desc    Create new booking request
// @route   POST /api/bookings
// @access  Private
router.post("/", protect, async (req: any, res) => {
  try {
    const { patient, caregiver, service, startDate, endDate, totalAmount, notes } = req.body;

    let booking: any = await Booking.create({
      patient,
      caregiver,
      service,
      startDate,
      endDate,
      totalAmount,
      status: "pending",
      paymentStatus: "pending",
      notes: notes || "",
    });

    // Populate references for immediate frontend usage
    booking = await Booking.findById(booking._id)
      .populate("patient")
      .populate("caregiver")
      .populate("service");


    // Notify the caregiver about the new booking
    if (booking.caregiver?.user) {
      const caregiverUserId = booking.caregiver.user._id?.toString() || booking.caregiver.user.toString();
      await createNotification(
        caregiverUserId,
        "new_booking",
        "New Booking Request",
        `You have a new booking request from ${booking.patient?.name || "a patient"} starting ${new Date(startDate).toLocaleDateString()}`,
        booking._id.toString(),
        "Booking"
      );
    }

    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get current user's bookings (Patient or Caregiver)
// @route   GET /api/bookings/me
// @access  Private
router.get("/me", protect, async (req: any, res) => {
  try {
    let filter = {};
    if (req.user.role === "caregiver") {
      const Caregiver = mongoose.model("Caregiver");
      const cg: any = await Caregiver.findOne({ user: req.user._id });
      if (cg) filter = { caregiver: cg._id };
    } else {
      const Patient = mongoose.model("Patient");
      const pt: any = await Patient.findOne({ user: req.user._id });
      if (pt) filter = { patient: pt._id };
    }

    const bookings = await Booking.find(filter)
      .populate("patient")
      .populate("caregiver")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get all bookings (Admin access)
// @route   GET /api/bookings
// @access  Private/Admin
router.get("/", protect, authorize("admin"), async (req, res) => {
  try {
    const bookings = await Booking.find({})
      .populate("patient")
      .populate("caregiver")
      .populate("service")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Update booking status with full lifecycle management
// @route   PUT /api/bookings/:id/status
// @access  Private
router.put("/:id/status", protect, async (req: any, res) => {
  try {
    const { status } = req.body;

    // Valid transitions
    const validTransitions: Record<string, string[]> = {
      pending: ["confirmed", "cancelled"],
      confirmed: ["active", "cancelled"],
      active: ["completed", "cancelled"],
      completed: [],
      cancelled: [],
    };

    const existing: any = await Booking.findById(req.params.id)
      .populate("patient")
      .populate("caregiver")
      .populate("service");

    if (!existing) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const allowed = validTransitions[existing.status];
    if (!allowed.includes(status)) {
      return res.status(400).json({
        message: `Cannot transition from '${existing.status}' to '${status}'. Allowed: ${allowed.join(", ") || "none"}`,
      });
    }

    existing.status = status;
    await existing.save();

    const booking: any = await Booking.findById(req.params.id)
      .populate("patient")
      .populate("caregiver")
      .populate("service");


    // Send notifications based on status change
    const patientUserId = booking.patient?.user?._id?.toString() || booking.patient?.user?.toString();
    const caregiverUserId = booking.caregiver?.user?._id?.toString() || booking.caregiver?.user?.toString();

    if (status === "confirmed" && patientUserId) {
      await createNotification(
        patientUserId,
        "booking_accepted",
        "Booking Confirmed!",
        `Your booking with ${booking.caregiver?.name || "your caregiver"} has been confirmed.`,
        booking._id.toString(),
        "Booking"
      );
    }

    if (status === "completed") {
      if (patientUserId) {
        await createNotification(
          patientUserId,
          "booking_completed",
          "Care Session Completed",
          `Your care session has been completed. Thank you for using Care24!`,
          booking._id.toString(),
          "Booking"
        );
      }
      if (caregiverUserId) {
        await createNotification(
          caregiverUserId,
          "booking_completed",
          "Session Completed",
          `Care session completed for ${booking.patient?.name || "patient"}.`,
          booking._id.toString(),
          "Booking"
        );
      }
    }

    if (status === "cancelled") {
      const otherUserId = req.user.role === "patient" ? caregiverUserId : patientUserId;
      if (otherUserId) {
        await createNotification(
          otherUserId,
          "booking_cancelled",
          "Booking Cancelled",
          `A booking has been cancelled.`,
          booking._id.toString(),
          "Booking"
        );
      }
    }

    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Get caregiver revenue analytics
// @route   GET /api/bookings/revenue/me
// @access  Private (Caregiver)
router.get("/revenue/me", protect, async (req: any, res) => {
  try {
    if (req.user.role !== "caregiver") {
      return res.status(403).json({ message: "Not authorized as caregiver" });
    }

    const Caregiver = mongoose.model("Caregiver");
    const cg: any = await Caregiver.findOne({ user: req.user._id });
    if (!cg) return res.status(404).json({ message: "Caregiver not found" });

    // Fetch active or completed bookings for this caregiver
    const bookings = await Booking.find({
      caregiver: cg._id,
      status: { $in: ["active", "completed"] },
    });

    let totalEarnings = 0;
    let mtdPay = 0;
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const revenueByDay: Record<string, number> = {
      Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0,
    };

    bookings.forEach((b) => {
      const amount = b.totalAmount || 0;
      totalEarnings += amount;

      const startDate = new Date(b.startDate);
      if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) {
        mtdPay += amount;
      }

      const dayName = days[startDate.getDay()];
      revenueByDay[dayName] += amount;
    });

    const chartData = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((day) => ({
      time: day,
      amount: revenueByDay[day],
    }));

    res.json({ totalEarnings, mtdPay, chartData });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

// @desc    Admin platform metrics
// @route   GET /api/bookings/admin/metrics
// @access  Private (Admin)
router.get("/admin/metrics", protect, authorize("admin"), async (req: any, res) => {
  try {
    const User = mongoose.model("User");
    const Caregiver = mongoose.model("Caregiver");
    const CareNote = mongoose.model("CareNote");
    const Complaint = mongoose.model("Complaint");

    const [totalUsers, totalCaregivers, verifiedCaregivers, totalBookings, activeBookings, careNotesLogged] =
      await Promise.all([
        User.countDocuments({}),
        Caregiver.countDocuments({}),
        Caregiver.countDocuments({ isVerified: true }),
        Booking.countDocuments({}),
        Booking.countDocuments({ status: { $in: ["pending", "confirmed", "active"] } }),
        CareNote.countDocuments({}),
      ]);

    // Advanced PRD KPIs
    // 1. Completion Rate
    const completedBookings = await Booking.countDocuments({ status: "completed" });
    const cancelledBookings = await Booking.countDocuments({ status: "cancelled" });
    const bookingCompletionRate = (completedBookings + cancelledBookings) > 0 
      ? (completedBookings / (completedBookings + cancelledBookings)) * 100 
      : 100;

    // 2. Average Response Time (minutes)
    // Calculate based on confirmed, active, or completed bookings (difference between updatedAt and createdAt)
    const confirmedBookingsList = await Booking.find({ status: { $in: ["confirmed", "active", "completed"] } });
    let totalResponseTimeMs = 0;
    let countedAccepts = 0;

    confirmedBookingsList.forEach((b: any) => {
      if (b.createdAt && b.updatedAt) {
        const diff = new Date(b.updatedAt).getTime() - new Date(b.createdAt).getTime();
        if (diff > 0) {
          totalResponseTimeMs += diff;
          countedAccepts++;
        }
      }
    });

    const avgResponseTimeMinutes = countedAccepts > 0 
      ? (totalResponseTimeMs / countedAccepts) / 60000 
      : 15; // default fallback 15 mins if no bookings accepted yet

    // 3. User Satisfaction Score
    const caregiversList = await Caregiver.find({});
    let totalRating = 0;
    let ratedCount = 0;
    caregiversList.forEach((cg: any) => {
      if (cg.rating !== undefined) {
        totalRating += cg.rating;
        ratedCount++;
      }
    });
    const userSatisfactionScore = ratedCount > 0 ? totalRating / ratedCount : 5.0;

    // 4. Monthly Active Users (MAU)
    // Compile distinct user refs from active users, bookings, care notes, and complaints updated this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const [newUsers, activeBookingsList, activeComplaintsList, activeNotesList] = await Promise.all([
      User.find({ createdAt: { $gte: startOfMonth } }).select("_id"),
      Booking.find({ updatedAt: { $gte: startOfMonth } }).populate("patient caregiver"),
      Complaint.find({ createdAt: { $gte: startOfMonth } }).populate("patient"),
      CareNote.find({ createdAt: { $gte: startOfMonth } }).populate("patient caregiver")
    ]);

    const activeUserIdsSet = new Set<string>();

    newUsers.forEach((u: any) => activeUserIdsSet.add(u._id.toString()));
    activeBookingsList.forEach((b: any) => {
      if (b.patient?.user) activeUserIdsSet.add(b.patient.user.toString());
      if (b.caregiver?.user) activeUserIdsSet.add(b.caregiver.user.toString());
    });
    activeComplaintsList.forEach((c: any) => {
      if (c.patient?.user) activeUserIdsSet.add(c.patient.user.toString());
    });
    activeNotesList.forEach((n: any) => {
      if (n.patient?.user) activeUserIdsSet.add(n.patient.user.toString());
      if (n.caregiver?.user) activeUserIdsSet.add(n.caregiver.user.toString());
    });

    const monthlyActiveUsers = activeUserIdsSet.size || 1;

    res.json({
      totalUsers,
      totalCaregivers,
      verifiedCaregivers,
      totalBookings,
      activeBookings,
      careNotesLogged,
      bookingCompletionRate,
      avgResponseTimeMinutes,
      userSatisfactionScore,
      monthlyActiveUsers
    });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
});

export default router;
