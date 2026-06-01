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
    const { patientName, rating, comment } = req.body;

    const BookingModel = mongoose.model("Booking");
    const PatientModel = mongoose.model("Patient");
    const patientProfile: any = await PatientModel.findOne({ user: req.user._id });
    if (!patientProfile) {
      return res.status(403).json({ message: "Review rejected. Patient profile must exist before posting reviews." });
    }
    
    const hasCompletedBooking = await BookingModel.findOne({
      patient: patientProfile._id,
      status: "completed"
    });
    
    if (!hasCompletedBooking) {
      return res.status(403).json({ message: "Review rejected. You must have at least one completed booking to post a review." });
    }

    let review = await Review.findOne({ user: req.user._id });

    if (review) {
      review.patientName = patientName;
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      review = new Review({
        user: req.user._id,
        patientName,
        rating,
        comment
      });
      await review.save();
    }
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
