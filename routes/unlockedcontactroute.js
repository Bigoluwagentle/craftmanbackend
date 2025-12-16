const express = require("express");
const router = express.Router();
const {
  unlockContact,
  getMyUnlockedContacts,
  checkIfUnlocked,
} = require("../controllers/unlockedcontactcontroller");
const { protect } = require("../middleware/auth");

router.post("/unlock", protect, unlockContact);

router.get("/my-contacts", protect, getMyUnlockedContacts);

router.get("/check/:artisanId", protect, checkIfUnlocked);

module.exports = router;