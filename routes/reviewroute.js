const express = require("express");
const router = express.Router();
const {
  createReview,
  getArtisanReviews,
  getMyReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewcontroller");
const { protect } = require("../middleware/auth");

router.post("/", protect, createReview);

router.get("/artisan/:artisanId", getArtisanReviews);

router.get("/my-reviews", protect, getMyReviews);

router.put("/:reviewId", protect, updateReview);

router.delete("/:reviewId", protect, deleteReview);

module.exports = router;