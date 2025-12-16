const User = require("../models/User");
const path = require("path");
const fs = require("fs");

const uploadProfilePicture = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image file" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profilePicture) {
      const oldImagePath = path.join(__dirname, "..", user.profilePicture);
      if (fs.existsSync(oldImagePath)) {
        fs.unlinkSync(oldImagePath);
      }
    }

    user.profilePicture = "/uploads/" + req.file.filename;
    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteProfilePicture = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.profilePicture) {
      return res.status(400).json({ message: "No profile picture to delete" });
    }

    const imagePath = path.join(__dirname, "..", user.profilePicture);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }

    user.profilePicture = "";
    await user.save();

    res.json({ message: "Profile picture deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
};