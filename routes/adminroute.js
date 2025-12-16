const express = require("express");
const router = express.Router();
const {
  getUnverifiedArtisans,
  getVerifiedArtisans,
  verifyArtisan,
  unverifyArtisan,
  getAllUsers,
  deleteUser,
} = require("../controllers/admincontroller");
const { protect, admin } = require("../middleware/auth");

router.get("/artisans/unverified", protect, admin, getUnverifiedArtisans);

router.get("/artisans/verified", protect, admin, getVerifiedArtisans);

router.put("/artisan/verify/:userId", protect, admin, verifyArtisan);

router.put("/artisan/unverify/:userId", protect, admin, unverifyArtisan);

router.get("/users", protect, admin, getAllUsers);


router.delete("/user/:userId", protect, admin, deleteUser);

module.exports = router;