const express = require("express");
const router = express.Router();
const { registerUser, loginUser, getUserProfile, verifyEmail, resendVerificationCode, forgotPassword, resetPassword } = require("../controllers/authcontroller");
const { protect } = require("../middleware/auth");

router.post("/register", registerUser);

router.post("/verify-email", verifyEmail);

router.post("/resend-verification", resendVerificationCode);

router.post("/login", loginUser);

router.post("/forgot-password", forgotPassword);

router.post("/reset-password", resetPassword);

router.get("/profile", protect, getUserProfile);

module.exports = router;