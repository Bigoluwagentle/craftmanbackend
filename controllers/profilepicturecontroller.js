const User = require("../models/User");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

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
      const urlParts = user.profilePicture.split('/');
      const publicIdWithExtension = urlParts[urlParts.length - 1];
      const publicId = `profile-pictures/${publicIdWithExtension.split('.')[0]}`;
      
      try {
        await cloudinary.uploader.destroy(publicId);
      } catch (err) {
        console.log("Error deleting old image:", err);
      }
    }

    user.profilePicture = req.file.path;
    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.json({
      message: "Profile picture uploaded successfully",
      profilePicture: user.profilePicture,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Upload error:", error);
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

    const urlParts = user.profilePicture.split('/');
    const publicIdWithExtension = urlParts[urlParts.length - 1];
    const publicId = `profile-pictures/${publicIdWithExtension.split('.')[0]}`;

    try {
      await cloudinary.uploader.destroy(publicId);
    } catch (err) {
      console.log("Error deleting image from Cloudinary:", err);
    }

    user.profilePicture = "";
    await user.save();

    const updatedUser = await User.findById(req.user._id).select("-password");

    res.json({ 
      message: "Profile picture deleted successfully",
      user: updatedUser 
    });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  uploadProfilePicture,
  deleteProfilePicture,
};