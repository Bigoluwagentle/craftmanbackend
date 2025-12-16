const mongoose = require("mongoose");

const unlockedContactSchema = new mongoose.Schema(
  {
    clientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    artisanId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Artisan",
      required: true,
    },
    unlockedAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

unlockedContactSchema.index({ clientId: 1, artisanId: 1 }, { unique: true });

module.exports = mongoose.model("UnlockedContact", unlockedContactSchema);