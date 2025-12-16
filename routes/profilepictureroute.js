const express = require("express");
const router = express.Router();
const { uploadProfilePicture, deleteProfilePicture } = require("../controllers/profilepicturecontroller");
const { protect } = require("../middleware/auth");
const upload = require("../middleware/upload");

router.post("/upload", protect, upload.single("profilePicture"), uploadProfilePicture);

router.delete("/delete", protect, deleteProfilePicture);

module.exports = router;