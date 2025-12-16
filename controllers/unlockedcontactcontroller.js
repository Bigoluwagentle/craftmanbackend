const UnlockedContact = require("../models/UnlockedContact");
const Artisan = require("../models/Artisan");
const User = require("../models/User");

const unlockContact = async (req, res) => {
  try {
    const { artisanId } = req.body;

    if (req.user.role !== "client") {
      return res.status(403).json({ message: "Only clients can unlock contacts" });
    }

    const artisan = await Artisan.findById(artisanId);
    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    const existingUnlock = await UnlockedContact.findOne({
      clientId: req.user._id,
      artisanId,
    });

    if (existingUnlock) {
      return res.status(400).json({ message: "Contact already unlocked" });
    }

    const user = await User.findById(req.user._id);
    
    if (user.subscription.status !== "active") {
      return res.status(403).json({ message: "Active subscription required to unlock contacts" });
    }

    if (user.subscription.unlockedContacts <= 0) {
      return res.status(403).json({ message: "No unlocked contacts remaining. Please upgrade your plan." });
    }

    const unlockedContact = await UnlockedContact.create({
      clientId: req.user._id,
      artisanId,
    });

    user.subscription.unlockedContacts -= 1;
    await user.save();

    const populatedUnlock = await UnlockedContact.findById(unlockedContact._id)
      .populate({
        path: "artisanId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      });

    res.status(201).json({
      message: "Contact unlocked successfully",
      unlockedContact: populatedUnlock,
      remainingContacts: user.subscription.unlockedContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyUnlockedContacts = async (req, res) => {
  try {
    const unlockedContacts = await UnlockedContact.find({ clientId: req.user._id })
      .populate({
        path: "artisanId",
        populate: {
          path: "userId",
          select: "name email phone",
        },
      })
      .sort({ unlockedAt: -1 });

    res.json(unlockedContacts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const checkIfUnlocked = async (req, res) => {
  try {
    const unlockedContact = await UnlockedContact.findOne({
      clientId: req.user._id,
      artisanId: req.params.artisanId,
    });

    res.json({ isUnlocked: !!unlockedContact });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  unlockContact,
  getMyUnlockedContacts,
  checkIfUnlocked,
};