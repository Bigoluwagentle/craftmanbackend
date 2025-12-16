const Review = require("../models/Review");
const Artisan = require("../models/Artisan");
const User = require("../models/User");

const createReview = async (req, res) => {
  try {
    const { artisanId, rating, comment } = req.body;

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can leave reviews" });
    }

    if (!artisanId || !rating || !comment) {
      return res.status(400).json({ message: "Please provide artisan, rating, and comment" });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ message: "Rating must be between 1 and 5" });
    }

    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    const existingReview = await Review.findOne({
      artisanId,
      clientId: req.user._id,
    });

    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this artisan" });
    }

    const review = await Review.create({
      artisanId,
      clientId: req.user._id,
      rating,
      comment,
    });

    const reviews = await Review.find({ artisanId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / reviews.length;

    artisan.rating = averageRating;
    artisan.numberOfReviews = reviews.length;
    await artisan.save();

    const populatedReview = await Review.findById(review._id).populate(
      "clientId",
      "name"
    );

    res.status(201).json({
      message: "Review submitted successfully",
      review: populatedReview,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtisanReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ artisanId: req.params.artisanId })
      .populate("clientId", "name")
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ clientId: req.user._id })
      .populate({
        path: "artisanId",
        populate: {
          path: "userId",
          select: "name",
        },
      })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;

    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this review" });
    }

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    const reviews = await Review.find({ artisanId: review.artisanId });
    const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
    const averageRating = totalRating / reviews.length;

    const artisan = await Artisan.findById(review.artisanId);
    artisan.rating = averageRating;
    await artisan.save();

    res.json({ message: "Review updated successfully", review });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);

    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    if (review.clientId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to delete this review" });
    }

    const artisanId = review.artisanId;

    await Review.deleteOne({ _id: review._id });

    const reviews = await Review.find({ artisanId });
    
    const artisan = await Artisan.findById(artisanId);
    
    if (reviews.length > 0) {
      const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
      artisan.rating = totalRating / reviews.length;
      artisan.numberOfReviews = reviews.length;
    } else {
      artisan.rating = 0;
      artisan.numberOfReviews = 0;
    }

    await artisan.save();

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createReview,
  getArtisanReviews,
  getMyReviews,
  updateReview,
  deleteReview,
};