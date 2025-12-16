const mongoose = require("mongoose");

const artisanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    craftType: {
      type: String,
      required: [true, "Please provide your craft type"],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, "Please provide years of experience"],
    },
    location: {
      type: String,
      required: [true, "Please provide your location"],
      trim: true,
    },
    bio: {
      type: String,
      maxlength: 500,
    },
    skills: {
      type: [String],
      default: [],
    },
    portfolioImages: {
      type: [String],
      default: [],
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numberOfReviews: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Artisan", artisanSchema);