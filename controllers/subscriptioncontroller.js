const User = require("../models/User");

const subscribe = async (req, res) => {
  try {
    const { plan } = req.body;

    if (!plan || !["basic-monthly", "basic-yearly", "pay-per-contact"].includes(plan)) {
      return res.status(400).json({ message: "Invalid subscription plan" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const startDate = new Date();
    let endDate;
    let unlockedContacts = 0;

    if (plan === "basic-monthly") {
      endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 1);
      unlockedContacts = 5;
    } else if (plan === "basic-yearly") {
      endDate = new Date();
      endDate.setFullYear(endDate.getFullYear() + 1);
      unlockedContacts = 50;
    } else if (plan === "pay-per-contact") {
      endDate = null; 
      unlockedContacts = 0; 
    }

    user.subscription = {
      plan,
      status: "active",
      startDate,
      endDate,
      unlockedContacts,
    };

    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.json({
      message: "Subscription updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getSubscriptionStatus = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("subscription");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.subscription);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const cancelSubscription = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.subscription.status = "cancelled";
    await user.save();

    res.json({ message: "Subscription cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  subscribe,
  getSubscriptionStatus,
  cancelSubscription,
};