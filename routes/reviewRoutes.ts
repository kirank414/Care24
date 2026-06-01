import express from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/Review.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get public reviews (for homepage)
router.get('/public', async (req, res) => {
  try {
    const minRating = Number(req.query.minRating) || 4;
    const reviews = await Review.find({ rating: { $gte: minRating }, isVisible: true })
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get all reviews (for admin)
router.get('/', protect, authorize('admin'), async (req, res) => {
  try {
    const reviews = await Review.find().sort({ createdAt: -1 });
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching reviews' });
  }
});

// Get current user's review
router.get('/user', protect, async (req: any, res) => {
  try {
    const review = await Review.findOne({ user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching review' });
  }
});

// Create or update review
router.post('/', protect, async (req: any, res) => {
  try {
    const { patientName, rating, comment, caregiverId, bookingId } = req.body;

    if (!caregiverId || !bookingId) {
      return res.status(400).json({ message: "caregiverId and bookingId are required to submit a review." });
    }

    const BookingModel = mongoose.model("Booking");
    const CaregiverModel = mongoose.model("Caregiver");
    const PatientModel = mongoose.model("Patient");
    
    const patientProfile: any = await PatientModel.findOne({ user: req.user._id });
    if (!patientProfile) {
      return res.status(403).json({ message: "Review rejected. Patient profile must exist before posting reviews." });
    }
    
    const booking = await BookingModel.findOne({
      _id: bookingId,
      patient: patientProfile._id,
      caregiver: caregiverId,
    });
    
    if (!booking) {
      return res.status(404).json({ message: "Booking not found or you do not have permission to review it." });
    }

    if (booking.status !== "completed") {
      return res.status(403).json({ message: "Review rejected. You can only review completed bookings." });
    }

    if (booking.isReviewed) {
      return res.status(400).json({ message: "Review already submitted for this service." });
    }

    // Double check if a review already exists for this exact booking just in case
    let review = await Review.findOne({ booking: bookingId, user: req.user._id });

    if (review) {
      return res.status(400).json({ message: "Review already submitted for this service." });
    }

    review = new Review({
      user: req.user._id,
      caregiver: caregiverId,
      booking: bookingId,
      patientName,
      rating,
      comment
    });
    await review.save();

    // Mark the booking as reviewed
    booking.isReviewed = true;
    await booking.save();

    // Recalculate exact average rating for this caregiver
    const allReviews = await Review.find({ caregiver: caregiverId });
    const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
    const avgRating = allReviews.length > 0 ? Number((totalRating / allReviews.length).toFixed(1)) : 5.0;

    await CaregiverModel.findByIdAndUpdate(caregiverId, {
      rating: avgRating,
      reviewCount: allReviews.length
    });

    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error saving review' });
  }
});

// Admin: Toggle visibility
router.patch('/:id/visibility', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    review.isVisible = !review.isVisible;
    await review.save();
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: 'Error updating review' });
  }
});

// Admin: Delete review
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }
    res.json({ message: 'Review deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting review' });
  }
});

export default router;
