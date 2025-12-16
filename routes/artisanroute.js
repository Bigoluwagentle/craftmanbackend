const express = require("express");
const router = express.Router();
const {
  getArtisanProfile,
  updateArtisanProfile,
  getAllVerifiedArtisans,
  getArtisanById,
  searchArtisans,
} = require("../controllers/artisancontroller");
const { protect, artisan } = require("../middleware/auth");

router.get("/profile", protect, artisan, getArtisanProfile);

router.put("/profile", protect, artisan, updateArtisanProfile);

router.get("/all", getAllVerifiedArtisans);

router.get("/search", searchArtisans);

router.get("/:id", getArtisanById);

module.exports = router;