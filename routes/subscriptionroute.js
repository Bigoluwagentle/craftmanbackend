const express = require("express");
const router = express.Router();
const {
  subscribe,
  getSubscriptionStatus,
  cancelSubscription,
} = require("../controllers/subscriptioncontroller");
const { protect } = require("../middleware/auth");

router.post("/subscribe", protect, subscribe);

router.get("/status", protect, getSubscriptionStatus);

router.put("/cancel", protect, cancelSubscription);

module.exports = router;