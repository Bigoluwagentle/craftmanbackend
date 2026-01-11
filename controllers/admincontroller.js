const User = require("../models/User");
const Artisan = require("../models/Artisan");

const getUnverifiedArtisans = async (req, res) => {
  try {
    const emailVerifiedUsers = await User.find({
      role: "artisan",
      isVerified: true, 
    }).select("_id");

    const userIds = emailVerifiedUsers.map((user) => user._id);
    
    const artisanProfiles = await Artisan.find({ 
      userId: { $in: userIds },
      isVerified: false 
    }).populate(
      "userId",
      "name email phone isVerified createdAt profilePicture" 
    );

    res.json(artisanProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getVerifiedArtisans = async (req, res) => {
  try {
    const emailVerifiedUsers = await User.find({
      role: "artisan",
      isVerified: true, 
    }).select("_id");

    const userIds = emailVerifiedUsers.map((user) => user._id);
    
    const artisanProfiles = await Artisan.find({ 
      userId: { $in: userIds },
      isVerified: true 
    }).populate(
      "userId",
      "name email phone isVerified createdAt profilePicture" 
    );

    res.json(artisanProfiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyArtisan = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "artisan") {
      return res.status(400).json({ message: "User is not an artisan" });
    }

    const artisan = await Artisan.findOne({ userId: user._id });
    
    if (!artisan) {
      return res.status(404).json({ message: "Artisan profile not found" });
    }

    artisan.isVerified = true;
    await artisan.save();

    res.json({ message: "Artisan verified successfully", artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const unverifyArtisan = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role !== "artisan") {
      return res.status(400).json({ message: "User is not an artisan" });
    }

    const artisan = await Artisan.findOne({ userId: user._id });
    
    if (!artisan) {
      return res.status(404).json({ message: "Artisan profile not found" });
    }

    artisan.isVerified = false;
    await artisan.save();

    res.json({ message: "Artisan unverified successfully", artisan });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({}).select("-password");
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.role === "artisan") {
      await Artisan.deleteOne({ userId: user._id });
    }

    await User.deleteOne({ _id: user._id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getUnverifiedArtisans,
  getVerifiedArtisans,
  verifyArtisan,
  unverifyArtisan,
  getAllUsers,
  deleteUser,
};