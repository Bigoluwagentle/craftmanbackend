const Artisan = require("../models/Artisan");
const User = require("../models/User");

const getArtisanProfile = async (req, res) => {
  try {
    const artisan = await Artisan.findOne({ userId: req.user._id }).populate(
      "userId",
      "name email phone isVerified"
    );

    if (!artisan) {
      return res.status(404).json({ message: "Artisan profile not found" });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateArtisanProfile = async (req, res) => {
  try {
    const { craftType, experience, location, bio, skills, portfolioImages } = req.body;

    const artisan = await Artisan.findOne({ userId: req.user._id });

    if (!artisan) {
      return res.status(404).json({ message: "Artisan profile not found" });
    }

    if (craftType) artisan.craftType = craftType;
    if (experience) artisan.experience = experience;
    if (location) artisan.location = location;
    if (bio) artisan.bio = bio;
    if (skills) artisan.skills = skills;
    if (portfolioImages) artisan.portfolioImages = portfolioImages;

    const updatedArtisan = await artisan.save();

    res.json(updatedArtisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getAllVerifiedArtisans = async (req, res) => {
  try {
    const verifiedUsers = await User.find({ role: "artisan", isVerified: true }).select("_id");
    
    const verifiedUserIds = verifiedUsers.map(user => user._id);

    const artisans = await Artisan.find({ userId: { $in: verifiedUserIds } }).populate(
      "userId",
      "name email phone"
    );

    res.json(artisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getArtisanById = async (req, res) => {
  try {
    const artisan = await Artisan.findById(req.params.id).populate(
      "userId",
      "name email phone isVerified"
    );

    if (!artisan) {
      return res.status(404).json({ message: "Artisan not found" });
    }

    const user = await User.findById(artisan.userId);
    if (!user.isVerified) {
      return res.status(403).json({ message: "Artisan is not verified yet" });
    }

    res.json(artisan);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchArtisans = async (req, res) => {
  try {
    const { craftType, location } = req.query;

    let query = {};

    if (craftType) {
      query.craftType = { $regex: craftType, $options: "i" }; 
    }

    if (location) {
      query.location = { $regex: location, $options: "i" };
    }

    const artisans = await Artisan.find(query).populate("userId", "name email phone isVerified");

    const verifiedArtisans = artisans.filter(artisan => artisan.userId.isVerified);

    res.json(verifiedArtisans);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getArtisanProfile,
  updateArtisanProfile,
  getAllVerifiedArtisans,
  getArtisanById,
  searchArtisans,
};